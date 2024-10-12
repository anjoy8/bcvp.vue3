import mitt from 'mitt';

// 定义事件类型
type Events = {
    callFunction: Menu.MenuOptions;
};

// 创建已键入的 mitt 实例
const emitter = mitt<Events>();

export default emitter;