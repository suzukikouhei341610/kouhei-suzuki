const app = new Vue({
    el: '#app', // Vueが管理する一番外側のDOM要素
    vuetify: new Vuetify(),
    data: {
        title: '',  // タスクのタイトル格納変数
        status: '', // タスクのステータス格納変数
        due_date: '', // タスクの期限格納変数
        dataList: [], // データ表示用配列
        menu: false, // カレンダーの表示制御
    },
    methods: {
        // DBにデータを追加する関数
        addData: async function() {
            if(!this.title || !this.status || !this.due_date){
                console.log("すべてのフィールドにデータを入力してください");
                return;
            }
            
            const param = {
                title: this.title,
                status: this.status,
                due_date: this.due_date
            };
            
            try {
                const response = await axios.post('https://m3h-kouhei-2010.azurewebsites.net/api/INSERT', param);
                console.log(response.data);
                this.readData(); // データを登録した後、最新のリストを表示
            } catch (error) {
                console.error("データの登録に失敗しました", error);
            }
        },
        // データベースからデータを取得する関数
        readData: async function() {
            try {
                const response = await axios.get('https://m3h-kouhei-2010.azurewebsites.net/api/SELECT');
                console.log(response.data);
                this.dataList = response.data.List;
            } catch (error) {
                console.error("データの取得に失敗しました", error);
            }
        },
        // データの編集を行う関数
        editData: function(index) {
            const task = this.dataList[index];
            this.title = task.Title;
            this.status = task.Status;
            this.due_date = task.DueDate.split('T')[0]; // 日付部分のみを使用
        },
        // データの削除を行う関数
        deleteData: async function(index) {
            const task = this.dataList[index];
            try {
                const response = await axios.post('https://m3h-kouhei-2010.azurewebsites.net/api/DELETE', { taskID: task.TaskID });
                console.log(response.data);
                this.readData(); // 削除後のリストを更新
            } catch (error) {
                console.error("データの削除に失敗しました", error);
            }
        },
        // データの更新を行う関数
        updateData: async function(index) {
            const task = this.dataList[index];
            const param = {
                taskID: task.TaskID,
                title: this.title,
                status: this.status,
                due_date: this.due_date
            };
            
            try {
                const response = await axios.post('https://m3h-kouhei-2010.azurewebsites.net/api/UPDATE', param);
                console.log(response.data);
                this.readData(); // 更新後のリストを表示
            } catch (error) {
                console.error("データの更新に失敗しました", error);
            }
        }
    }
});