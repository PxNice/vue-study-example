class Watcher{
    constructor(mvm,key,cb){
        this.mvm = mvm
        //data 中的属性名称
        this.key = key
        //回调函数负责更新视图
        this.cb = cb

        //把watcher对象记录到Dep类的静态属性target
        Dep.target = this
        //触发get方法，在get方法中会调用addSub
        this.oldValue = mvm[key]
        Dep.target = null
    }

    //当数据发生变化的时候 更新视图
    update(){
        let newValue = this.mvm[this.key]
        if(this.oldValue === newValue){
            return
        }
        this.cb(newValue)
    }

    //当创建watcher对象时 要添加的到dep 数组中



}