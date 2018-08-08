<template>
    <section class="page">
        <div v-title :data-title="$route.name"></div>
        <searchbar></searchbar>
        <!-- 商品类别 -->
        <ul class="category-tabs">
            <li 
                v-for="(item, index) in categoryList" 
                :key="index" 
                class="tab-item" 
                :class="{active: item.id === categoryId}" 
                @click="handleCategoryChange(item)">
                <span>{{item.name}}</span>
            </li>
        </ul>
        <div class="brand-box">
            <!-- 品牌列表 -->
            <div class="brand-sidebar">
                <ul class="brand-list">
                    <li class="brand-item"
                     :class="{active: brandId === 0}" 
                        @click="handleBrandChange({id: 0})">
                        全部品牌
                    </li>
                    <li 
                        v-for="item in brandList" 
                        :key="item.id" 
                        class="brand-item"
                        :class="{active: item.id === brandId}"
                        @click="handleBrandChange(item)">
                        {{item.name}}
                    </li>
                </ul>
            </div>
            <!-- 型号列表 -->
            <div class="model-main">
                <ul class="model-column-box">
                    <li v-for="(item, index) in currBrandModelList" :key="index" class="model-column">
                        <div class="brand-title">{{item.name}}</div>
                        <ul class="model-list">
                            <li class="model-item" v-for="(item, index) in item.productResponseList" :key="index">
                                <a href="javascript:;" @click="handelModelClick(item)">
                                <!-- <router-link :to="'/product/list?model='+item.name+'&productId='+item.id+'&categoryId='+categoryId+'&utm_source='+utmSource+'&utm_medium='+utmMedium" @click.native="handelModelClick(item)"> -->
                                    <img :src="item.skuUrl">
                                    <p>{{item.name}}</p>
                                <!-- </router-link> -->
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <tabbar></tabbar>
    </section>
</template>
<script>
import { getCategoryList, getSkuByBrandList } from "@/api";
import searchbar from "@/components/searchbar";
import tabbar from "@/components/tabbar";
export default {
  name: "Category",
  components: {
    searchbar,
    tabbar
  },
  data() {
    return {
      categoryId: 1,
      brandId: 0,
      categoryList: [],
      brandList: [],
      brandModelList: [],
      currBrandModelList: [],
      utmSource: '',
      utmMedium: '',
      // modelLists: [
      //   {
      //     id: 1,
      //     name: "苹果",
      //     brandSkuResponseList: [
      //       {
      //         id: 2184,
      //         name: "iPhone 5s",
      //         skuUrl:
      //           "//imgs.kjershou.com/image/product/32621e8f8ca48d35a99232564e4c7b420bfd0eef.jpg@150w_150h_1e_1c.jpg"
      //       },
      //       {
      //         id: 2185,
      //         name: "iPhone SE",
      //         skuUrl:
      //           "//imgs.kjershou.com/image/product/b97275fe2818a3e0b3f89c77cc8d1a0f2ce66f1e.jpg@150w_150h_1e_1c.jpg"
      //       },
      //       {
      //         id: 2187,
      //         name: "iPhone 6",
      //         skuUrl:
      //           "//imgs.kjershou.com/image/product/c33940ea816d1972f4b958bf5e76a60c8251df52.jpg@150w_150h_1e_1c.jpg"
      //       },
      //       {
      //         id: 2188,
      //         name: "iPhone 6 Plus",
      //         skuUrl:
      //           "//imgs.kjershou.com/image/product/12eca45d5b28003cfdb37312b531698b91a50edc.jpg@150w_150h_1e_1c.jpg"
      //       },
      //       {
      //         id: 2189,
      //         name: "iPhone 6s",
      //         skuUrl:
      //           "//imgs.kjershou.com/image/product/7fa96e1179565badee5aa11170a7470320ebd404.jpg@150w_150h_1e_1c.jpg"
      //       },
      //       {
      //         id: 2190,
      //         name: "iPhone 6s Plus",
      //         skuUrl:
      //           "//imgs.kjershou.com/image/product/f4762a3c21682d7ad830fc24a7eaf5d35a00f72c.jpg@150w_150h_1e_1c.jpg"
      //       },
      //       {
      //         id: 2195,
      //         name: "iPhone 7",
      //         skuUrl:
      //           "//imgs.kjershou.com/image/product/79bf14d1d6a43139adda742529ac8849c32dd7e1.jpg@150w_150h_1e_1c.jpg"
      //       },
      //       {
      //         id: 2196,
      //         name: "iPhone 7 Plus",
      //         skuUrl:
      //           "//imgs.kjershou.com/image/product/d332adeb0b2aca9cd0132a86523fb90d7a03d342.jpg@150w_150h_1e_1c.jpg"
      //       },
      //       {
      //         id: 2342,
      //         name: "iPhone 8",
      //         skuUrl:
      //           "//imgs.kjershou.com/image/product/085b54393820e0c8f3b982c177adc8b7d07b22ef.jpg@150w_150h_1e_1c.jpg"
      //       },
      //       {
      //         id: 2343,
      //         name: "iPhone 8 Plus",
      //         skuUrl:
      //           "//imgs.kjershou.com/image/product/0ce2ab0a7bb563e7dba0509b09701d8a8a63abd2.jpg@150w_150h_1e_1c.jpg"
      //       },
      //       // {
      //       //   id: 2447,
      //       //   name: "iPhone X",
      //       //   skuUrl:
      //       //     "//imgs.kjershou.com/image/product/cfc04a12d4d764ea55ca78e333bc4bc0caa86848.jpg"
      //       // }
      //     ]
      //   },
      //   {
      //     id: 5,
      //     name: "华为",
      //     brandSkuResponseList: [
      //       {
      //         id: 2247,
      //         name: "P10",
      //         skuUrl:
      //           "//imgs.kjershou.com/image/product/777b316ae44f390c49dde808b28abca4d0d381ad.jpg@150w_150h_1e_1c.jpg"
      //       }
      //     ]
      //   },
      //   {
      //     id: 9,
      //     name: "小米",
      //     brandSkuResponseList: [
      //       {
      //         id: 2372,
      //         name: "Mix 2",
      //         skuUrl:
      //           "//imgs.kjershou.com/image/product/e9724d26aec197cca42c896ecfa54cb2e92e1597.jpg@150w_150h_1e_1c.jpg"
      //       }
      //     ]
      //   }
      // ],
    };
  },
  methods: {
    // 品类列表
    getCategoryLists() {
      let data = {
        utmSource: this.utmSource,
        utmMedium: this.utmMedium
      }
      getCategoryList(data).then(res => {
          if (res.code === "0") {
            this.categoryList = res.body;
            this.categoryList.forEach(item => {
              item.id = item.categoryId;
              item.name = item.categoryName;
            });
            this.categoryId = this.categoryList[0].id;
            this.getBrandLists();
          } else {
            this.$showToast(res.message);
          }
        })
        .catch(err => {
          console.log(err)
          this.$showToast("服务器响应错误");
        });
    },
    // 获取品牌列表及型号列表
    getBrandLists() {
      let data = {
        categoryId: this.categoryId,
        utmSource: this.utmSource,
        utmMedium: this.utmMedium
      };
      getSkuByBrandList(data).then(res => {
        if (res.code === "0") {
          let _brandList = [];
          // res.body.brandList
          this.currBrandModelList = this.brandModelList = res.body.brandList;
          this.brandId = 0;
          res.body.brandList.forEach(item => {
            _brandList.push({id: item.id, name: item.name})
          })
          this.brandList = _brandList;
        } else {
          this.$showToast(res.message);
        }
      });
    },
    // 类别切换
    handleCategoryChange(item) {
      if (item.id === this.categoryId) return;
      this.categoryId = item.id;
      this.getBrandLists()
      // this.brandId = 0;
      // if (item.id === 7) {
      //    _paq.push(['trackEvent', '30.ClassPage', '30.10.Class', '30.10.10.Phone']);
      //   if (this.brandList.length === 0) {
      //     this.getBrandLists();
      //   } else {
      //     this.currBrandList = this.brandList;
      //     this.currModelList = this.modelList;
      //   }
      // } else if (item.id === 8) {
      //    _paq.push(['trackEvent', '30.ClassPage', '30.10.Class', '30.10.11.Pad']);
      //   if (this.padBrandList.length === 0) {
      //     this.getPadBrandLists();
      //   } else {
      //     this.currBrandList = this.padBrandList;
      //     this.currModelList = this.padModelList;
      //   }
      // }
    },
    // 品牌切换
    handleBrandChange(item) {
      if (this.brandId === item.id) return;
      this.brandId = item.id;
      if(this.brandId == 0) {
          this.currBrandModelList = this.brandModelList;
          return;
      }
      this.currBrandModelList = this.brandModelList.filter(brand => brand.id === this.brandId);
      if (this.categoryId === 7) {
        switch(this.brandId) {
          case 0 : 
            _paq.push(['trackEvent', '30.ClassPage', '30.11.PhoneBrand', '30.11.10.All']);
            break;
          case 1 : 
            _paq.push(['trackEvent', '30.ClassPage', '30.11.PhoneBrand', '30.11.11.iPhone']);
            break;
          case 5 : 
            _paq.push(['trackEvent', '30.ClassPage', '30.11.PhoneBrand', '30.11.13.Huawei']);
            break;
          case 9 : 
            _paq.push(['trackEvent', '30.ClassPage', '30.11.PhoneBrand', '30.11.12.Mi']);
            break;
        }
      } else if (this.categoryId === 8) {
        switch(this.brandId) {
          case 0 : 
            _paq.push(['trackEvent', '30.ClassPage', '30.12.PadBrand', '30.12.10.All']);
            break;
          case 1 : 
            _paq.push(['trackEvent', '30.ClassPage', '30.12.PadBrand', '30.12.11.iPad']);
            break;
        }
      }
    },
    // 型号点击
    handelModelClick(item) {
        if(this.categoryId === 15) {
          this.$router.push(`/peijian/list?model=${item.name}&productId=${item.id}`)
        } else {
          this.$router.push(`/product/list?model=${item.name}&productId=${item.id}&categoryId=${this.categoryId}`)
        }
        switch(item.name) {
          case 'iPhone 5s' : 
            _paq.push(['trackEvent', '30.ClassPage', '30.13.PhoneModel', '30.13.10.iPhone 5s']);
            break;
          case 'iPhone SE' : 
            _paq.push(['trackEvent', '30.ClassPage', '30.13.PhoneModel', '30.13.11.iPhone SE']);
            break;
          case 'iPhone 6' : 
            _paq.push(['trackEvent', '30.ClassPage', '30.13.PhoneModel', '30.13.12.iPhone 6']);
            break;
          case 'iPhone 6 Plus' : 
            _paq.push(['trackEvent', '30.ClassPage', '30.13.PhoneModel', '30.13.13.iPhone 6 Plus']);
            break;
          case 'iPhone 6s' : 
            _paq.push(['trackEvent', '30.ClassPage', '30.13.PhoneModel', '30.13.14.iPhone 6s']);
            break;
          case 'iPhone 6s Plus' : 
            _paq.push(['trackEvent', '30.ClassPage', '30.13.PhoneModel', '30.13.15.iPhone 6s Plus']);
            break;
          case 'iPhone 7' : 
            _paq.push(['trackEvent', '30.ClassPage', '30.13.PhoneModel', '30.13.16.iPhone 7']);
            break;
          case 'iPhone 7 Plus' : 
            _paq.push(['trackEvent', '30.ClassPage', '30.13.PhoneModel', '30.13.17.iPhone 7 Plus']);
            break;
          case 'iPhone 8' : 
            _paq.push(['trackEvent', '30.ClassPage', '30.13.PhoneModel', '30.13.18.iPhone 8']);
            break;
          case 'iPhone 8 Plus' : 
            _paq.push(['trackEvent', '30.ClassPage', '30.13.PhoneModel', '30.13.19.iPhone 8 Plus']);
            break;
          case 'Mix2' : 
            _paq.push(['trackEvent', '30.ClassPage', '30.13.PhoneModel', '30.13.20.Mix2']);
            break;
          case 'P10' : 
            _paq.push(['trackEvent', '30.ClassPage', '30.13.PhoneModel', '30.13.21.P10']);
            break;
          case 'iPad Mini' : 
            _paq.push(['trackEvent', '30.ClassPage', '30.14.PadModel', '30.14.10.iPad Mini']);
            break;
          case 'iPad Mini2' : 
            _paq.push(['trackEvent', '30.ClassPage', '30.14.PadModel', '30.14.11.iPad Mini2']);
            break;
          case 'iPad Mini4' : 
            _paq.push(['trackEvent', '30.ClassPage', '30.14.PadModel', '30.14.12.iPad Mini4']);
            break;
          case 'iPad Air' : 
            _paq.push(['trackEvent', '30.ClassPage', '30.14.PadModel', '30.14.13.iPad Air']);
            break;
          case 'iPad Air2' : 
            _paq.push(['trackEvent', '30.ClassPage', '30.14.PadModel', '30.14.14.iPad Air2']);
            break;
        }
    }
  },
  mounted() {
    this.utmSource = localStorage.getItem('utm_source') || this.$utm_source;
    this.utmMedium = localStorage.getItem('utm_medium') || this.$utm_medium;
    this.getCategoryLists();
  }
};
</script>
<style lang="scss" scoped>
.page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  padding-top: 1rem;
  background: #fff;
}
.category-tabs {
  display: flex;
  height: 1rem;
  line-height: 1rem;
  padding: 0 0.6rem;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  .tab-item {
    height: 1rem;
    line-height: 1rem;
    padding-top: 3px;
    // padding: 0.3rem 0;
    margin-right: 0.6rem;
    font-size: 0.32rem;
    &.active {
      font-weight: bolder;
      border-bottom: 3px solid #f3c91e;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
.brand-box {
  display: flex;
  position: relative;
  height: calc(100% - 2rem);
  .brand-sidebar {
    width: 2rem;
    background: #fafafa;
    overflow-y: auto;
    .brand-item {
      padding: 0.3rem;
      text-align: center;
      font-size: 0.28rem;
      &.active {
        background: #fff;
      }
    }
  }
  .model-main {
    flex: 1;
    overflow-y: auto;
    padding: 0.32rem 0.2rem;
    background: #fff;
    .model-column-box {
      .model-column {
        margin-bottom: 0.3rem;
        .brand-title {
          padding: 0 0 0 0.2rem;
          font-size: 0.28rem;
          font-weight: bolder;
        }
        .model-list {
          display: flex;
          flex-wrap: wrap;
          text-align: center;
          .model-item {
            width: 33%;
            padding: 0.2rem;
            img {
              width:100%;
            }
            p {
              word-break: break-word;
              white-space: pre-wrap;
            }
          }
        }
      }
    }
  }
}
</style>