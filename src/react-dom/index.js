import Component from "../react/component";

function autoCreateDOM(element){
  let eleWithDOM;
  if(element.type instanceof Function){
    let elecConstructor = element.type;
    let obj = new elecConstructor();
    eleWithDOM = createDOM(obj.render());
  } else if(typeof element.type == 'string'){
    // 创建dom
    let dom;
    if(element.type == 'TEXT_ELEMENT'){
      dom = document.createTextNode('')
    } else {
      dom = document.createElement(element.type)
    }
    // 挂载属性
    if(!!element.props){
      Object.keys(element.props).forEach(prop => {
        dom[prop] = element.props[prop];
      })
    }
    // 处理children
    let children = [];
    if(!!element.children && !!element.children.length) {
      children = element.children.map(child => {
        let childEleWithDOM = createDOM(child);
        if(!!dom && !!childEleWithDOM.dom){
          dom.append(childEleWithDOM.dom);
        }
        return childEleWithDOM;
      })
    }
    eleWithDOM = {
      ...element,
      dom,
      children
    }
  }
  return eleWithDOM;
}

function handleClassElement(element) {
  if(element.type.__proto__ == Component){
    let eleConstructor = element.type;
    let eleObj = new eleConstructor();
    return eleObj.render();
  } else if (element.type instanceof Function) {
    return element.type();
  } else {
    return element;
  }
}


function createDOM(element){
    let dom;
    if(element.type == 'TEXT_ELEMENT'){
      dom = document.createTextNode('')
    } else {
      dom = document.createElement(element.type)
    }
    // 挂载属性
    if(!!element.props){
      Object.keys(element.props).forEach(prop => {
        dom[prop] = element.props[prop];
      })
    }
    return dom;
    
}

let taskStack = [];

const sleep = delay => {
  for (let start = Date.now(); Date.now() - start <= delay;) {}
}

function performUnitWork () {
  let topFiber = taskStack.pop();

  topFiber.dom = createDOM(topFiber.element);
  
  topFiber.parent.dom.append(topFiber.dom);

  let children = topFiber.element.children;

  // sleep(30);

  if(!!children && !!children.length){
    let preFiber = null;
    children.reverse().forEach((child, index) => {
      let newFiber = {
        element: handleClassElement(child),
        parent: topFiber,
        sibling: preFiber
      }
      preFiber = newFiber;
      if(index == children.length - 1){
        topFiber.child = newFiber;
      }
      taskStack.push(newFiber);
    })
  }
  console.log('渲染了', topFiber);
}

function workloop (deadline) {
  console.log(`此帧的剩余时间为: ${deadline.timeRemaining()}`);

  while(deadline.timeRemaining() > 0 && !!taskStack.length){
    performUnitWork();
  }

  if(!taskStack.length) {
    // renderDom();
  }

  // 如果还有未完成的任务，继续调用requestIdleCallback申请下一个时间片
  if(!!taskStack.length){
    requestIdleCallback(workloop)
  }
}

requestIdleCallback(workloop);

function render(element, container){
  // element的格式参见 createElement
  if(!!element && !!container){
    taskStack.push({
      element: handleClassElement(element),
      parent: { dom: container },
      sibling: null
    });
  }
}

let ReactDOM = {
  render
};

export default ReactDOM;
