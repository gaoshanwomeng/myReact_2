

function createDOM(element){
  let eleWithDOM;
  if(element.type instanceof Function){
    let elecConstructor = element.type;
    let obj = new elecConstructor();
    eleWithDOM = createDOM(obj.render());
    // return obj.render();
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
    // 形成Fiber
    eleWithDOM = {
      ...element,
      dom,
      children
    }
  }
  return eleWithDOM;
}

function render(element, container){
  // element的格式参见 createElement
  if(!!element && !!container){
    // nextEle = element
    let eleWithDOM = createDOM(element);
    console.log(eleWithDOM);
    container.append(eleWithDOM.dom);
  }
}

const sleep = delay => {
  for (let start = Date.now(); Date.now() - start <= delay;) {}
}

let taskQueue = [
  () => {
    console.log('task1 start')
    sleep(20) // 已经超过一帧的时间（16.6ms），需要把控制权交给浏览器
    console.log('task1 end')
  },
  () => {
    console.log('task2 start')
    sleep(20) // 已经超过一帧的时间（16.6ms），需要把控制权交给浏览器
    console.log('task2 end')
  },
  () => {
    console.log('task3 start')
    sleep(20) // 已经超过一帧的时间（16.6ms），需要把控制权交给浏览器
    console.log('task3 end')
  }
]

// let taskQueue = [
//   () => {
//     console.log('task1 start')
//     console.log('task1 end')
//   },
//   () => {
//     console.log('task2 start')
//     console.log('task2 end')
//   },
//   () => {
//     console.log('task3 start')
//     console.log('task3 end')
//   }
// ]

const performUnitWork = () => {
  // 取出第一个队列中的第一个任务并执行
  taskQueue.shift()()
}

const workloop = (deadline) => {
  console.log(`此帧的剩余时间为: ${deadline.timeRemaining()}`)
  // 如果此帧剩余时间大于0或者已经到了定义的超时时间（上文定义了timeout时间为1000，到达时间时必须强制执行），且当时存在任务，则直接执行这个任务
  // 如果没有剩余时间，则应该放弃执行任务控制权，把执行权交还给浏览器
  while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && taskQueue.length > 0) {
    performUnitWork()
  }

  // 如果还有未完成的任务，继续调用requestIdleCallback申请下一个时间片
  if (taskQueue.length > 0) {
    requestIdleCallback(workloop, { timeout: 1000 })
  }
}

requestIdleCallback(workloop, { timeout: 1000 });



let ReactDOM = {
  render
};

export default ReactDOM;
