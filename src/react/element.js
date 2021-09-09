/**
 * @description 创建vDOM
 * @param  type 元素类型
 * @param  props 属性对象
 * @param  {Array} children 子元素集合
 */
function createElement(type, props, ...children) {
  return {
    type,
    props,
    children: children.map(child => {
      return typeof child == 'string' ? 
        createTextElement(child)
        :
        child
    })
  }
}

function createTextElement(textStr) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: textStr
    },
    children: null
  }
}

export default createElement;
