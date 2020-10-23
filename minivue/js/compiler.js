class Compiler {
    constructor(mvm) {
        this.el = mvm.$el
        this.mvm = mvm
        this.compile(this.el)
    }

    //编译模板，处理文本节点和元素节点
    compile(el) {
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {

            if (this.isTextNode(node)) {
                //处理文本节点
                this.compileText(node)
            } else if (this.isElementNode(node)) {
                //处理元素节点
                this.compileElement(node)
            }

            //判断node节点，是否有子节点，如果有子节点，要递归调用compile
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }


        })
    }

    //编译元素节点，处理指令
    compileElement(node) {
        //console.log(node.attributes)
        //遍历所有的属性节点
        Array.from(node.attributes).forEach(attr => {
            //判断是否是指令
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                // v-text --> text
                attrName = attrName.substr(2)
                let key = attr.value
                this.update(node, key, attrName)

            }
        })
    }

    update(node, key, attrName) {
        let updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this, node, this.mvm[key], key)
    }

    //处理 v-text 指令
    textUpdater(node, value, key) {
        node.textContent = value
        new Watcher(this.mvm, key, (newValue) => {
            node.textContent = newValue
        })
    }

    //处理 v-model 指令
    modelUpdater(node, value, key) {
        node.value = value
        new Watcher(this.mvm, key, (newValue) => {
            node.value = newValue
        })
        //双向绑定
        node.addEventListener('input',()=>{
            this.mvm[key] = node.value
        })

    }

    //编译文本节点，处理 差值表达式
    compileText(node) {
        // console.dir(node)
        //{{ msg }}
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if (reg.test(value)) {
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.mvm[key])

            //创建watcher对象，当数据改变更新视图
            new Watcher(this.mvm, key, (newValue) => {
                node.textContent = newValue
            })
        }
    }

    //判断元素属性是否是指令
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }

    //判断节点 是否是文本节点
    isTextNode(node) {
        return node.nodeType === 3
    }

    //判断节点是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }




}