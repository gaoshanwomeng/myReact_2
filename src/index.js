import ReactDOM from './react-dom';
import React from './react';


class SubComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    console.log("subComponent will mount");
  }
  componentDidMount() {
    console.log("subComponent did mount");
  }

  render() {
    return (
      <div>
        <h1>subComponent</h1>
      </div>
    )
  }
}

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'xiaoming'
    }
  }

  changeName = () => {
    alert('修改名字');
  }

  componentWillMount() {
    console.log("will");
  }
  componentDidMount() {
    console.log("did");
  }

  render() {
    const { name } = this.state;
    return (
      <div>
        <h1 id='title'>hello, react</h1>
        <button onClick={this.changeName}>哈哈哈</button>
        <h2>{name}</h2>
        <SubComponent/>
      </div>
    )
  }
}

console.log(<Counter/>);

ReactDOM.render(<Counter/>, document.getElementById("root"));
