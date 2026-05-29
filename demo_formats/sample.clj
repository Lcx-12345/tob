(defn demo-tools []
  (let [tools [{:name "Write" :category "文件操作" :description "写入文件到本地文件系统"}
               {:name "Read" :category "文件操作" :description "读取本地文件"}
               {:name "RunCommand" :category "命令执行" :description "执行终端命令"}
               {:name "WebSearch" :category "网络" :description "搜索互联网"}]]
    (doseq [{:keys [name category description]} tools]
      (println (format "[%s] %s: %s" category name description)))))

(demo-tools)
