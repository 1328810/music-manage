<template>
    <div class="table">
        <div class="crumbs">
            <i class="el-icon-tickets">歌曲信息</i>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="danger" size="mini" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" size="mini" placeholder="请输入歌曲名" class="handle-input"></el-input>
                <el-button type="primary" size="mini" @click="centerDialogVisible=true">添加歌曲</el-button>
            </div>
        </div>
        <!-- 数据列表 -->
        <el-table size="mini" ref="multipleTTable" border style="width:100%" height="680px" :data="data" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40" ></el-table-column>
            <el-table-column label="歌曲图片" width="110px" align="center">
                <template slot-scope="scope">
                    <div class="song-img">
                        <img :src="getUrl(scope.row.pic)" style="width:100%">
                    </div>
                    <div class="play" @click="setSongUrl(scope.row.url,scope.row.name)">
                        <div v-if="toggle == scope.row.name">
                            <svg class="icon">
                                <use xlink:href="#icon-zanting"></use>
                            </svg>
                        </div>
                        <div v-if="toggle != scope.row.name">
                            <svg class="icon">
                                <use xlink:href="#icon-bofanganniu"></use>
                            </svg>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="歌手-歌名" width="120" align="center"></el-table-column>
            <el-table-column prop="introduction" label="专辑" width="150" align="center"></el-table-column>
            <el-table-column label="歌词" align="center">
                <template slot-scope="scope">
                    <ul style="height:100px;overflow:scroll">
                        <li v-for="(item,index) in parseLyric(scope.row.lyric)" :key="index">
                            {{item}}
                        </li>
                    </ul>         
                </template>
            </el-table-column>
            <el-table-column label="资源更新" align="center">
                <template slot-scope="scope">
                    <el-upload 
                    :action="uploadUrl(scope.row.id)" 
                    :before-upload="beforeAvatorUpload" 
                    :on-success="handleAvatorSuccess">
                    <el-button size="mini">更新图片</el-button>
                    </el-upload>
                    <br>
                    <el-upload 
                    :action="uploadSongUrl(scope.row.id)" 
                    :before-upload="beforeSongUpload" 
                    :on-success="handleSongSuccess">
                    <el-button size="mini">更新歌曲</el-button>
                    </el-upload>
                </template>
            </el-table-column>
            <el-table-column label="操作"  width="150" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination">
            <el-pagination
                background
                layout="total,prev,pager,next"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="tableData.length"
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>
        <!-- 添加歌曲 -->
        <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible" width="450px" center>
            <el-form :model="registerForm" ref="registerForm" label-width="80px" action="" id="add-song">
                <el-form-item label="歌曲名">
                    <el-input type="text" name="name" v-model="registerForm.name"></el-input>
                </el-form-item>
                <el-form-item label="专辑">
                    <el-input type="text" name="introduction" v-model="registerForm.introduction"></el-input>
                </el-form-item>
                <el-form-item label="歌词">
                    <el-input type="textarea" name="lyric" v-model="registerForm.lyric"></el-input>
                </el-form-item>
                <el-form-item label="歌曲上传">
                    <input type="file" name="file" />
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="centerDialogVisible=false">取消</el-button>
                <el-button size="mini" @click="addSong">确定</el-button>
            </span>
        </el-dialog>
            <!--修改歌曲  -->
        <el-dialog title="修改歌曲" :visible.sync="editVisible" width="450px" center>
            <el-form :model="editForm" ref="editForm" label-width="80px">
                <el-form-item prop="name" label="歌手-歌名" size="mini">
                    <el-input v-model="editForm.name" placeholder="歌手-歌名"></el-input>
                </el-form-item>
                <el-form-item prop="introduction" label="专辑" size="mini">
                    <el-input v-model="editForm.introduction" placeholder="专辑"></el-input>
                </el-form-item>
                <el-form-item prop="lyric" label="歌词" size="mini">
                    <el-input v-model="editForm.lyric" placeholder="歌词" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="editVisible=false">取消</el-button>
                <el-button size="mini" @click="editSave">确定</el-button>
            </span>
        </el-dialog>
        <!-- 删除歌手 -->
        <el-dialog title="修改歌手" :visible.sync="delVisible" width="300px" center>
            <div align:center>删除不可恢复，是否确定删除</div>
            <span slot="footer">
                <el-button size="mini" @click="delVisible=false">取消</el-button>
                <el-button size="mini" @click="deleteRow">确定</el-button>
            </span>
        </el-dialog>
    </div>
    </template>
    
    <script>
    import { mixin } from '../mixins';
    import {mapGetters} from 'vuex'
    import '../assets/icons/iconfont'
    import {songOfSingerId,deleteSong,updateSong} from '../api/index';
    export default {
        mixins:[mixin],
        data(){
            return{
                singerId:'',    //歌手id
                singerName:'',  //歌手名
                centerDialogVisible:false,  //添加弹窗是否显示
                editVisible:false,          //编辑弹窗是否显示
                delVisible:false,           //删除弹窗是否显示
                registerForm:{  //添加框
                    name:'',
                    singerName:'',
                    introduction:'',
                    lyric:'',
                },
                editForm:{      //编辑框
                    id:'',
                    name:'',
                    introduction:'',
                    lyric:'',
                },
                tableData:[],
                tempData:[],
                select_word:'',
                pageSize:5,     //分页每页大小
                currentPage:1,   //当前页
                idx:-1,     //当前选择项
                multipleSelection:[],    //哪些项已经选择
                toggle:false    //播放器的显示图标状态
            }
        },
        computed:{
            //计算当前搜索结果里的数据
            data() {
                return this.tableData.slice((this.currentPage - 1) * this.pageSize,this.currentPage * this.pageSize)
            },
            ...mapGetters([
                'isPlay'
            ])
        },
        watch:{
            //搜索框里面的内容发生变化的时候，搜索结果table列表的内容跟着他的内容发生变化
            select_word:function(){
                if(this.select_word == ''){
                    this.tableData = this.tempData
                }else{
                    this.tableData = [];
                    for(let item of this.tempData){
                        if(item.name.includes(this.select_word)){
                            this.tableData.push(item)
                        }
                    }
                }
            }
        },
        created(){
            this.singerId = this.$route.query.id
            this.singerName = this.$route.query.name
            this.getData()
        },
        destroyed(){
            this.$store.commit('setIsPlay',false)
        },
        methods:{
            // 获取当前页
            handleCurrentChange(val){
                this.currentPage = val
            },
            // 查询所有歌曲
            getData(){
                this.tempData=[];
                this.tableData=[];
                songOfSingerId(this.singerId).then(res => {
                    this.tempData = res;
                    this.tableData = res;
                    this.currentPage = 1;
                })
            },
            // 添加歌手
            addSong(){
                let _this = this;
                var form = new FormData(document.getElementById('add-song'));
                form.append('singerId',this.singerId);
                form.set('name',this.singerName+'-'+form.get('name'));
                if(!form.get('lyric')){
                    form.set('lyric','[00:00:00]暂无歌词')
                }
                var req = new XMLHttpRequest() 
                req.onreadystatechange =  function(){
                    // req.readyState == 4获取到返回的完整数据
                    //req.status == 200和后台正常交互
                    if(req.readyState == 4 && req.status == 200){
                        let res = JSON.parse(this.response)
                        if(res.code){
                            _this.getData();
                            _this.registerForm = {}
                            _this.notify(res.msg,"success")
                        }else{
                            _this.notify('上传失败',"error")
                        }
                    }
                }
                req.open('post',`${_this.$store.state.HOST}/song/add`,false)
                req.send(form)
                _this.centerDialogVisible = false;
            },
            //弹出编辑页面
            handleEdit(row){
                this.editVisible = true;
                this.editForm = {
                    id:row.id,
                    name:row.name,
                    introduction:row.introduction,
                    lyric:row.lyric,
                }
            },
            //保存编辑信息
            editSave(){
                let params = new URLSearchParams();
                params.append('id',this.editForm.id);
                params.append('name',this.editForm.name);
                params.append('introduction',this.editForm.introduction);
                params.append('lyric',this.editForm.lyric);
                updateSong(params)
                .then(res => {
                    if(res.code == 1){
                        this.getData()
                        this.notify("修改成功","success")
                    }else{
                        this.notify("修改失败","error")
                    }
                })
                .catch(err => {
                    console.log(err);
                });
                this.editVisible = false;
            },
            // 更新图片
            uploadUrl(id){
                return `${this.$store.state.HOST}/song/updateSongPic?id=${id}`
            },
            // 删除一首歌曲
            deleteRow(){
                deleteSong(this.idx)
                .then(res => {
                    if(res){
                        this.getData()
                        this.notify("删除成功","success")
                    }else{
                        this.notify("删除失败","error")
                    }
                })
                .catch(err => {
                    console.log(err);
                });
                this.delVisible = false;
        },
        // 解析歌词
        parseLyric(text){
            let lines = text.split('\n');
            let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;
            let result = []
            for(let item of lines){
                let value = item.replace(pattern,'');
                result.push(value)
            }
            return result
        },
        // 切换播放歌曲
        setSongUrl(url,name) {
            this.toggle = name;
            this.$store.commit('setUrl',this.$store.state.HOST + url);
            if(this.isPlay){
                this.$store.commit('setIsPlay',false);
            }else{
                this.$store.commit('setIsPlay',true);
            }
        }
    }
}
    </script>
    
    <style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
    .song-img {
        width: 100%;
        height: 80px;
        border-radius: 5px;
        margin-bottom: 5px;
        overflow: hidden;
    }
    
    .handle-input {
        width: 300px;
        display: inline-block;
    }
    
    .pagination {
        display: flex;
        justify-content: center;
    
    }
    .play {
        position: absolute;
        z-index: 100;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        top: 18px;
        left: 15px;
    }
    .icon {
        width: 2em;
        height: 2em;
        color: #eee;
        fill: currentColor;
        overflow: hidden;
    }
    </style>