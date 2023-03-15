<template>
  <div class="table">
    <div class="crumbs">
      <i class="el-icon-tickets">歌单歌曲信息</i>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="danger" size="mini" @click="delAll">批量删除</el-button>
        <el-input v-model="select_word" size="mini" placeholder="请输入歌曲名" class="handle-input"></el-input>
        <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加歌曲</el-button>
      </div>
    </div>
    <!-- 数据列表 -->
    <el-table size="mini" ref="multipleTTable" border style="width: 100%" height="680px" :data="data"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="name" label="歌手-歌名" align="center"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination background layout="total,prev,pager,next" :current-page="currentPage" :page-size="pageSize"
        :total="tableData.length" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!-- 添加歌曲 -->
    <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible" width="450px" center>
      <el-form :model="registerForm" ref="registerForm" label-width="80px" action="" id="add-song" :rules="rules">
        <el-form-item label="歌手名字">
          <el-input type="text" name="name" v-model="registerForm.singerName" placeholder="歌手名字"></el-input>
        </el-form-item>
        <el-form-item label="歌曲名字">
          <el-input type="text" name="name" v-model="registerForm.songName" placeholder="歌曲名字"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
        <el-button size="mini" @click="getSongId">确定</el-button>
      </span>
    </el-dialog>
    <!-- 删除歌手 -->
    <el-dialog title="修改歌手" :visible.sync="delVisible" width="300px" center>
      <div align:center>删除不可恢复，是否确定删除</div>
      <span slot="footer">
        <el-button size="mini" @click="delVisible = false">取消</el-button>
        <el-button size="mini" @click="deleteRow">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
    
<script>
import { mixin } from "../mixins";
import {
  songOfSongId,
  delListSong,
  songOfSongName,
  listSongAdd,
  listSongDetail,
} from "../api/index";
export default {
  mixins: [mixin],
  data() {
    return {
      centerDialogVisible: false, //添加弹窗是否显示
      delVisible: false, //删除弹窗是否显示
      registerForm: {
        //添加框
        singerName: "", //歌手名字
        songName: "", //歌曲名字
      },
      tableData: [],
      tempData: [],
      select_word: "",
      pageSize: 5, //分页每页大小
      currentPage: 1, //当前页
      idx: -1, //当前选择项
      multipleSelection: [], //哪些项已经选择
      songListId: "", //歌单id
      songId: "",
    };
  },
  computed: {
    //计算当前搜索结果里的数据
    data() {
      return this.tableData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
  },
  watch: {
    //搜索框里面的内容发生变化的时候，搜索结果table列表的内容跟着他的内容发生变化
    select_word: function () {
      if (this.select_word == "") {
        this.tableData = this.tempData;
      } else {
        this.tableData = [];
        for (let item of this.tempData) {
          if (item.name.includes(this.select_word)) {
            this.tableData.push(item);
          }
        }
      }
    },
  },

  created() {
    this.songListId = this.$route.query.id;
    this.getData();
  },
  methods: {
    // 获取当前页
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    // 查询所有歌曲
    getData() {
      this.tempData = [];
      this.tableData = [];
      listSongDetail(this.songListId).then((res) => {
        for (let item of res) {
          this.getSong(item.songId);
        }
      });
    },
    //根据歌曲id查询歌曲对象，放到tableData和tempData里面
    getSong(id) {
      songOfSongId(id)
        .then((res) => {
          this.tempData.push(res);
          this.tableData.push(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 添加歌手前的准备，获取到歌曲id
    getSongId() {
      let _this = this;
      var songOfName =
        _this.registerForm.singerName + "-" + _this.registerForm.songName;
      songOfSongName(songOfName).then((res) => {
        this.addSong(res[0].id);
      });
    },
    // 添加歌手
    addSong(songId) {
      let _this = this;
      let params = new URLSearchParams();
      params.append("songId", songId);
      params.append("songListId", this.songListId);
      listSongAdd(params)
        .then((res) => {
          if (res.code == 1) {
            this.getData();
            this.notify("添加成功", "success");
          } else {
            this.notify("添加失败", "error");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      _this.centerDialogVisible = false;
    },

    // 删除歌曲
    deleteRow() {
      delListSong(this.idx, this.songListId)
        .then((res) => {
          if (res) {
            this.getData();
            this.notify("删除成功", "success");
          } else {
            this.notify("删除失败", "error");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.delVisible = false;
    },
  },
};
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