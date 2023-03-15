export const mixin = {
    methods: {
        notify(title, type) {
            this.$notify({
                title: title,
                type: type,
            })
        },
        // 根据相对地址获取绝对地址
        getUrl(url) {
            return `${this.$store.state.HOST}${url}`
        },
        // 获取性别中文
        ChangeSex(value) {
            if (value == 0) {
                return '女';
            }
            if (value == 1) {
                return '男';
            }
            if (value == 2) {
                return '组合';
            }
            if (value == 3) {
                return '不明';
            }
        },
        // 获取生日方法
        attachBirth(val) {
            return String(val).substring(0, 10)
        },
        // 在上传图片之前的校验
        beforeAvatorUpload(file) {
            const isJPG = (file.type === 'image/jpeg') || (file.type === "image/png");
            if (!isJPG) {
                this.$message.error('上传头像图片只能是jpeg或png格式');
                return false
            }
            const isLt2M = (file.size / 1024 / 1024) < 2;
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过2M');
                return false
            }
            return true
        },
        // 上传图片之后要做的工作
        handleAvatorSuccess(res) {
            let _this = this;
            if (res.code = 1) {
                _this.getData();
                _this.$notify({
                    title: '上传成功',
                    type: 'success'
                });
            } else {
                _this.$notify({
                    title: '上传失败',
                    type: 'error'
                })
            }
        },
        // 在上传歌曲之前的校验
        beforeSongUpload(file) {
            var testMsg = file.name.substring(file.name.lastIndexOf('.') + 1);
            if (testMsg != 'mp3') {
                this.$message({
                    message: '上传文件只能是mp3格式',
                    type: 'error'
                });
                return false;
            }
            return true;
        },
        // 上传歌曲之后要做的工作
        handleSongSuccess(res) {
            let _this = this;
            if (res.code = 1) {
                _this.getData();
                _this.$notify({
                    title: '上传成功',
                    type: 'success'
                });
            } else {
                _this.$notify({
                    title: '上传失败',
                    type: 'error'
                })
            }
        },
        // 更新歌曲Url
        uploadSongUrl(id) {
            return `${this.$store.state.HOST}/song/updateSongUrl?id=${id}`
        },
        // 弹出删除窗口
        handleDelete(id) {
            this.idx = id;
            this.delVisible = true;
        },
        // 把已经选择的项赋值给multipleSelection
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        // 批量删除已经选择的项
        delAll() {
            for (let item of this.multipleSelection) {
                this.handleDelete(item.id);
                this.deleteRow();
                this.delVisible = false
            }
            this.multipleSelection = [];
        }
    }
}