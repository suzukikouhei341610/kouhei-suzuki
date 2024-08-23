const app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
        title: '',
        status: '',
        due_date: '',
        dataList: [],
        menu: false,
        headers: [
            { text: 'タイトル', value: 'Title' },
            { text: 'ステータス', value: 'Status' },
            { text: '期限', value: 'DueDate' },
            { text: '操作', value: 'action', sortable: false }
        ]
    },
    methods: {
        addData: async function() {
            if (!this.title || !this.status || !this.due_date) {
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
                this.readData();
            } catch (error) {
                console.error("データの登録に失敗しました", error);
            }
        },
        readData: async function() {
            try {
                const response = await axios.get('https://m3h-kouhei-2010.azurewebsites.net/api/SELECT');
                console.log(response.data);
                this.dataList = response.data.List;
            } catch (error) {
                console.error("データの取得に失敗しました", error);
            }
        },
        editData: function(index) {
            const task = this.dataList[index];
            this.title = task.Title;
            this.status = task.Status;
            this.due_date = task.DueDate.split('T')[0];
        },
        deleteData: async function(index) {
            const task = this.dataList[index];
            try {
                const response = await axios.post('https://m3h-kouhei-2010.azurewebsites.net/api/DELETE', { taskID: task.TaskID });
                console.log(response.data);
                this.readData();
            } catch (error) {
                console.error("データの削除に失敗しました", error);
            }
        },
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
                this.readData();
            } catch (error) {
                console.error("データの更新に失敗しました", error);
            }
        }
    }
});