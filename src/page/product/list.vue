<template>
  <section>
    <div v-title :data-title="$route.name"></div>
    <searchbar :content="this.searchName" isHome="true"></searchbar>
    <!-- 条件搜索 -->
    <div class="conditional-search">
        <!-- 条件搜索栏 -->
        <ul class="searchbar">
          <li class="searchbar-item" v-for="(item, index) of conditionTitle" :key="index">
            <span @click="handleConditionTitleClick(item)" :class="{'active': item.isActive, 'disabled': productList.length === 0 && !isSelected}">
              {{item.name}}
              <i class="iconfont" :class="[item.isActive ? 'icon-xiangshang': 'icon-xiangxia']"></i>
            </span>
          </li>
        </ul>
        <!-- 已选中条件 -->
        <div ref="selectedBar" class="selected-wrap">
          <ul class="selected-condition" v-show="hasSelectedCondition && currCondition === ''">
            <!-- 价格排序 -->
            <li class="s-condition-item" v-if="priceOrder.id">
              <span>{{priceOrder && priceOrder.name}}</span>
              <i class="times" @click="handleDelPriceOrder">&times;</i>
            </li>
            <!-- 机器来源 -->
            <li v-for="(item, index) in selectedOrigin" :key="index+10" class="s-condition-item">
              <span>{{item.name}}</span>
              <i class="times" @click="handleDelOrigin(item)">&times;</i>
            </li>
            <!-- 维修情况 -->
            <li class="s-condition-item" v-if="selectedRepair.id >= 0">
              <span>{{selectedRepair && selectedRepair.name}}</span>
              <i class="times" @click="handleDelRepair">&times;</i>
            </li>
            <!-- <li v-for="(item, index) in selectedRepair" :key="index+20" class="s-condition-item">
              <span>{{item.name}}</span>
              <i class="times" @click="handleDelRepair(item)">&times;</i>
            </li> -->
            <!-- <li v-for="(item, index) in selectedConditions" :key="index" class="s-condition-item">
              <span>{{item.data.name}}</span>
              <i class="times" @click="handleDelCondition(item)">&times;</i>
            </li> -->
            <!-- 更多筛选选中 -->
            <li v-for="(item, index) in selectedMoreConditions" :key="index+100" class="s-condition-item">
              <span>{{item.name}}</span>
              <i class="times" @click="handleDelMoreCondition(item)">&times;</i>
            </li>
          </ul>
        </div>
    </div>
    <div class="condition-content">
      <div class="c-content-body">
        <!-- 价格筛选 -->
        <ul class="s-content-list" v-show="currCondition === 'price'">
          <li 
            v-for="(item, index) in priceCondition" 
            :key="index" 
            class="c-content-item" 
            :class="{active: item.id === priceOrder.id}" 
            @click="handlePriceSelected(item)">
            {{item.name}}
          </li>
        </ul>
        <!-- 机器来源筛选 -->
        <ul class="s-content-list" v-show="currCondition === 'origin'">
          <li 
            v-for="(item, index) in originCondition" 
            :key="index" 
            class="c-content-item" 
            :class="{active: item.selected === true}" 
            @click="handleOriginSelected(item)">
            {{item.name}}
          </li>
        </ul>
        <!-- 维修情况筛选 -->
        <ul class="s-content-list" v-show="currCondition === 'maintenance'">
          <li 
            v-for="(item, index) in maintenanceCondition" 
            :key="index" 
            class="c-content-item" 
            :class="{active: item.id === selectedRepair.id}" 
            @click="handleMaintenanceSelected(item)">
            {{item.name}}
          </li>
        </ul>
      </div>
      <!-- 更多筛选 -->
      <div class="conditions-more-body" v-show="currCondition === 'more'">
        <ul class="condition-more-list">
          <li 
            class="condition-more-item" 
            v-for="(item, index) in filterObj" 
            :key="index">
            <label class="condition-item-name">{{filterMap[index]}}</label>
            <ul class="item-options">
              <li 
                v-for="(subItem, subIndex) in item" 
                :key="subIndex" 
                class="condition-option-item" 
                :class="{ 'active': subItem.selected }"
                @click="handleMoreSelected(subItem, subIndex, item, index)">
                {{subItem.name}}
              </li>
            </ul>
          </li>
        </ul>
        <div class="m-selection-button">
          <button class="reset-button" @click="handleConditionReset">重置</button>
          <button class="confirm-button" @click="handleConditionConfirm">确定</button>
        </div>
      </div>
      <!-- 遮罩层 -->
      <div v-show="currCondition !== '' && currCondition !== 'more'" class="condition-body-mask" @click="handleMaskClick" @touchmove.prevent></div>
    </div>
    <!-- 商品列表 -->
    <div v-show="currCondition !== 'more'" class="product-box" :style="{top: (1.8 + selectedBarHeight)+'rem'}">
      <mt-loadmore 
        v-if="productList.length > 0"
        ref="loadmore"
        :bottomDistance="20"
        :bottomAllLoaded="isAllLoaded"
        :bottomPullText="bottomPullText" 
        :bottom-method="productLoadMore">
        <ul class="product-list">
          <li class="product-item" v-for="item in productList" :key="item.id">
            <router-link :to="'/product/detail?serialNumber='+item.serialNumber+'&utm_source='+utmSource+'&utm_medium='+utmMedium" class="item-link">
              <div class="product-pic">
                <img :src="item.skuPicture">
              </div>
              <div class="product-detail">
                <div class="product-name detail-row">
                  <span class="item-chengse bg-yellow">{{item.pskuCondition}}</span>
                  <span class="item-name">{{item.skuName}}</span>
                </div>
                <div class="product-tag detail-row">
                  <ul class="tag-list">
                    <li v-if="item.skuOrigin" class="tag-item">{{item.skuOrigin}}</li>
                    <li v-if="item.skuMaintenance" class="tag-item" v-for="subItem in item.skuMaintenance" :key="subItem">
                      {{subItem}}
                    </li>
                  </ul>
                </div>
                <div class="product-price detail-row">
                  <div class="detail-price">
                    <span class="current-price text-red"><i class="font-rmb">￥</i>{{item.price}}</span>
                    <span class="original-price text-gray"><i class="font-rmb">￥</i>{{item.newPrice}}</span>
                  </div>
                    <div class="save">
                      <i class="s-text bg-red">省</i>
                      <span class="s-amount">
                        <i class="font-rmb">￥</i>{{item.newPrice - item.price}}
                      </span>
                    </div>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
         <div slot="bottom" class="mint-loadmore-bottom">
          <span v-show="bottomStatus !== 'loading'" :class="{ 'rotate': bottomStatus === 'drop' }" @click="productLoadMore">{{bottomPullText}}</span>
          <span v-show="bottomStatus === 'loading'">Loading...</span>
        </div>
      </mt-loadmore>
      <div v-else class="not-found">
        <img src="@/assets/img/notfound.png" style="width: 2.57rem;">
        <p class="text-gray">暂无相关商品！</p>
      </div>
    </div>
  </section>
</template>

<script>
  import searchbar from '@/components/searchbar';
  import {getConditions, getBaoKuan, searchProductList, getPinPaiList, getLowPricePhone, searchProductAll } from '@/api/index';
	export default {
    name: "List",
    components:{
      searchbar
    },
    data(){
		  return {
        productId: '',
        searchName: '',
        selectedBarHeight: 0,
        productList: [],
        pageNo: 1,
        pageSize: 4,
        totalPage: 1,
        bottomStatus: '',
        conditionTitle: [
          {
            name: '价格',
            value: 'price',
            isActive: false
          },
          {
            name: '机器来源',
            value: 'origin',
            isActive: false
          },
          {
            name: '维修情况',
            value: 'maintenance',
            isActive: false
          },
          {
            name: '筛选',
            value: 'more',
            isActive: false
          },
        ],
        priceOrder: {},
        selectedOrigin: [],
        selectedRepair: {},
        searchConditions: {
          priceOrder: {},
          skuOrigin: {},
          skuMaintenance: {},
        },
        searchMoreConditions: {
          brand: '',
          chengse: '',
          color: '',
          capacity: '',
          edition: '',
          network: '',
        },
        priceCondition: [
          {
            id: 'asc',
            name: '价格升序'
          },
           {
            id: 'desc',
            name: '价格降序'
          },
        ],
        originCondition: [],
        maintenanceCondition: [],
        filterObj: {},
        filterMap: {
          conditionList: '成色',
          capacityList: '容量',
          colourList: '颜色',
          editionList: '版本',
          networkList: '网络制式',
        },
        selectedFilter: {
          conditionIds: [],
          colourIds: [],
          capacityIds: [],
          editionIds: [],
          networkIds: [],
        },
        currCondition: '',
        currSelection: {},
        selectedMoreConditions: [],
        bottomStatus: '',
        isAllLoaded: false,
        skuList: [],
        bottomPullText: '上拉或点击加载更多',
        productEmpty: false,
        utmMedium: '',
        utmSource: '',
        isSelected: false
      }
    },
    mounted() {
      this.utmSource = localStorage.getItem('utm_source') || this.$utm_source;
      this.utmMedium = localStorage.getItem('utm_medium') || this.$utm_medium;
      this.searchName = this.$route.query.search || this.$route.query.model || '';
      this.productId = this.$route.query.productId || '';
      this.categoryId = this.$route.query.categoryId || '';
      this.getProductList()
      this.getConditions()
    },
    methods:{
      // 商品列表
      getProductList() {
        this.pageNo = 1;
        let repairId = this.selectedRepair.id >= 0 ? this.selectedRepair.id : '';
        let data = {
          utmMedium: this.utmMedium,
          utmSource: this.utmSource,
          param: this.searchName,
          productId: this.productId || '',
          categoryId:  this.categoryId || '',
          order: this.priceOrder.id || '',
          originIds: this.selectedOrigin.map(item => item.id),
          repairId,
          conditionIds: this.selectedFilter.conditionIds,
          colourIds: this.selectedFilter.colourIds,
          capacityIds: this.selectedFilter.capacityIds,
          editionIds: this.selectedFilter.editionIds,
          networkIds: this.selectedFilter.networkIds,
          pageNumber: this.pageNo,
          pageSize: this.pageSize,
        }
        searchProductList(data).then(res => {
          if(res.code === '0') {
            if(!res.body) {
              this.$showToast('暂无相关商品');
              this.productList = [];
              return;
            }
            if(res.body.key) {
              localStorage.setItem('product_key', res.body.key);
            }
            let skuList = res.body.skuList;
            this.totalPage = res.body.totalPage;
            skuList.forEach(item => {
              item.skuPicture = item.skuPicture+'@200w_240h_1e_1c.jpg';
            })
            this.skuList = skuList;
            this.productList = skuList;
            if(this.totalPage <= 1) {
              this.bottomPullText = '没有更多了^_^';
              this.isAllLoaded = true;
            } else {
              this.bottomPullText = '上拉或点击加载更多';
              this.isAllLoaded = false;
            }
          } else {
            this.$showToast( res.message)
          }
        }).catch(err => {
          console.log(err)
        })
        // 货号列表
        searchProductAll(data).then(res => {
          if(res.code === '0') {
            if(!res.body) {
              localStorage.removeItem('serialNumber');
              return;
            };
            let serialNumbers = res.body && res.body.serialNumbers;
            if(serialNumbers.length > 1) {
              localStorage.setItem('serialNumber', JSON.stringify(serialNumbers))
            } else {
              localStorage.removeItem('serialNumber')
            }
          } else {
            this.$showToast(res.message)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 商品列表加载更多
      productLoadMore() {
        if(this.isAllLoaded) return;
        let product_key = localStorage.getItem('product_key');
        let repairId = this.selectedRepair.id >= 0 ? this.selectedRepair.id : '';
        this.pageNo++;
        let data = {
          utmMedium: this.utmMedium,
          utmSource: this.utmSource,
          param: this.searchName,
          productId: this.productId || '',
          categoryId:  this.categoryId || '',
          order: this.priceOrder.id || '',
          originIds: this.selectedOrigin.map(item => item.id),
          repairId,
          conditionIds: this.selectedFilter.conditionIds,
          colourIds: this.selectedFilter.colourIds,
          capacityIds: this.selectedFilter.capacityIds,
          editionIds: this.selectedFilter.editionIds,
          networkIds: this.selectedFilter.networkIds,
          pageNumber: this.pageNo,
          pageSize: this.pageSize,
        }
        searchProductList(data).then(res => {
          if(!res.body) {
            this.bottomPullText = '没有更多了^_^';
            this.$showToast('没有更多商品了^_^', 3000);
          }
          this.$refs.loadmore.onBottomLoaded();
          if(res.code === '0') {
            let skuList = res.body.skuList;
            skuList.forEach(item => {
              item.skuPicture = item.skuPicture+'@100w_120h_1e_1c.jpg';
            })
            this.productList = this.productList.concat(skuList);
            if(this.pageNo >= res.body.totalPage) {
              this.bottomPullText = '没有更多了^_^';
              this.isAllLoaded = true;
            } else{
              this.bottomPullText = '上拉或点击加载更多';
              this.isAllLoaded = false;
            }
          } else {
            this.$showToast(res.message)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      // 获取搜索条件
      getConditions() {
        let data = {
          productId: Number(this.productId)
        } 
        getConditions(data).then(res => {
          if(!res.body) return;
          if(res.code === '0') {
            let {filter, origin, repair } = res.body;
            this.originCondition = origin;
            this.maintenanceCondition = repair;
            this.filterObj = filter;
          } else {
            this.$showToast(res.message)
          }
        })
      },
      // 切换筛选项目
      handleConditionTitleClick(item) {
        if((this.productList.length === 0) && this.isSelected === false) return;
        this.isSelected = true;
        switch(item.name) {
          case '价格' : 
            _paq.push(['trackEvent', '40.SearchPage', '40.10.ConditionClass', '40.10.10.Price']);
            break;
          case '机器来源' : 
            _paq.push(['trackEvent', '40.SearchPage', '40.10.ConditionClass', '40.10.11.Channel']);
            break;
          case '维修情况' : 
            _paq.push(['trackEvent', '40.SearchPage', '40.10.ConditionClass', '40.10.12.RepairRecord']);
            break;
          case '筛选' : 
            _paq.push(['trackEvent', '40.SearchPage', '40.10.ConditionClass', '40.10.13.SkuCondition']);
            break;
        }
        if(this.currCondition == item.value) {
          this.currCondition = '';
        } else {
          this.currCondition = item.value;
          this.conditionTitle.forEach(item => {
              if(this.currSelection != item) {
                item.isActive = false;
              }
          })
        }
        item.isActive = !item.isActive;
      },
      // 价格条件筛选
      handlePriceSelected(item) {
        switch(item.name) {
          case '价格升序' :
            _paq.push(['trackEvent', '40.SearchPage', '40.11.Price', '40.11.10.Asc']);
            break;
          case '价格降序' :
            _paq.push(['trackEvent', '40.SearchPage', '40.11.Price', '40.11.11.Desc']);
            break;
        }
        this.priceOrder = item;
        this.currCondition = '';
        this.conditionTitle.forEach(item => {
          item.isActive = false;
        })
        this.getProductList()
        setTimeout(() => {
          this.getSeletedBarHeight()
        }, 50)
      },
      // 机器来源条件筛选
      handleOriginSelected(item) {
        if(item.selected) return;
        switch(item.name) {
          case '个人机' :
            _paq.push(['trackEvent', '40.SearchPage', '40.12.Channel', '40.12.10.Personal']);
            break;
          case '官方机' :
            _paq.push(['trackEvent', '40.SearchPage', '40.12.Channel', '40.12.11.Apple']);
            break;
          case '自营机' :
            _paq.push(['trackEvent', '40.SearchPage', '40.12.Channel', '40.12.12.Kuangji']);
            break;
        }
        item.selected = true;
        this.selectedOrigin = this.originCondition.filter(origin => origin.selected)
        this.currCondition = '';
        this.conditionTitle.forEach(item => {
          item.isActive = false;
        })
        this.getProductList()
        setTimeout(() => {
          this.getSeletedBarHeight()
        }, 50)
      },
      // 维修条件筛选
      handleMaintenanceSelected(item) {
        if(this.selectedRepair.id === item.id) return;
        switch(item.name) {
          case '有维修' :
            _paq.push(['trackEvent', '40.SearchPage', '40.13.RepairRecord', '40.13.10.Yes']);
            break;
          case '无维修' :
            _paq.push(['trackEvent', '40.SearchPage', '40.13.RepairRecord', '40.13.11.No']);
            break;
        }
        // if(item.selected) return; 
        // item.selected = true;
        // this.selectedRepair = this.maintenanceCondition.filter(maintenance => maintenance.selected)
        this.selectedRepair = item;
        this.currCondition = '';
        this.conditionTitle.forEach(item => {
          item.isActive = false;
        })
        this.getProductList()
        setTimeout(() => {
          this.getSeletedBarHeight()
        }, 50)
      },
      // 遮罩层点击
      handleMaskClick() {
        this.currCondition = '';
        this.conditionTitle.forEach(item => {
          item.isActive = false;
        })
      },
      // 删除价格排序条件
      handleDelPriceOrder() {
        this.priceOrder = {};
        this.getProductList()
        setTimeout(() => {
          this.getSeletedBarHeight()
        }, 50)
      },
      // 删除来源条件
      handleDelOrigin(item) {
        item.selected = false;
        let index = this.selectedOrigin.indexOf(item);
        this.selectedOrigin.splice(index, 1);
        this.getProductList()
        setTimeout(() => {
          this.getSeletedBarHeight()
        }, 50)
      },
      // 删除维修情况条件
      handleDelRepair(item) {
        this.selectedRepair = {};
        // item.selected = false;
        // let index = this.selectedRepair.indexOf(item);
        // this.selectedRepair.splice(index, 1);
        this.getProductList()
        setTimeout(() => {
          this.getSeletedBarHeight()
        }, 50)
      },
      //删除单个选中条件 
      handleDelCondition(item) {
        this.searchConditions[item.name] = {};
      },
      // 删除选中更多条件
      handleDelMoreCondition(item) {
        item.selected = false;
        this.handleConditionConfirm()
      },
      // 更多条件点击
      handleMoreSelected(value, index, filterItem, filterIndex) {
        value.name = value.name + ' ';
        value.selected = !value.selected;
        value.name = value.name.trim();
        let selectedValue = value.name;
        switch(this.filterMap[filterIndex]) {
          case '成色' :
            _paq.push(['trackEvent', '41.SearchPage', '41.10.NewPercent', '41.10.NewPercent'+selectedValue]);
            break;
          case '颜色' :
            _paq.push(['trackEvent', '41.SearchPage', '41.11.Color', '41.11.Color'+selectedValue]);
            break;
          case '容量' :
            _paq.push(['trackEvent', '41.SearchPage', '41.12.Capacity', '41.12.Capacity'+selectedValue]);
            break;
          case '版本' :
            _paq.push(['trackEvent', '41.SearchPage', '41.13.Version', '41.13.Version'+selectedValue]);
            break;
          case '网络制式' :
            _paq.push(['trackEvent', '41.SearchPage', '41.14.Network', '41.14.Network'+selectedValue]);
            break;
        }
      },
      // 更多筛选重置
      handleConditionReset() {
        for(let i in this.filterObj) {
          this.filterObj[i].forEach(item => {
            item.name = item.name + ' ';
            item.selected = false;
            item.name = item.name.trim();
          });
        }
        _paq.push(['trackEvent', '41.SearchPage', '41.15.Reset', '41.15.Reset']);
      },
      // 更多筛选确定
      handleConditionConfirm() {
        _paq.push(['trackEvent', '41.SearchPage', '41.16.Confirm', '41.16.Confirm']);
        let filterList = [];
        this.selectedMoreConditions = [];
        for(let i in this.filterObj) {
          let _filter = this.filterObj[i].filter(item => item.selected === true);
          
          if(_filter.length > 0) {
            filterList.push(_filter)
          }
        }
        filterList.forEach(list => {
          list.forEach(li => {
            this.selectedMoreConditions.push(li)
          })
        })
        this.selectedFilter.conditionIds = this.filterObj['conditionList'] && this.filterObj['conditionList'].filter(item => item.selected).map(item => item.id);
        this.selectedFilter.colourIds = this.filterObj['colourList'] && this.filterObj['colourList'].filter(item => item.selected).map(item => item.id);
        this.selectedFilter.capacityIds = this.filterObj['capacityList'] && this.filterObj['capacityList'].filter(item => item.selected).map(item => item.id);
        this.selectedFilter.editionIds = this.filterObj['editionList'] && this.filterObj['editionList'].filter(item => item.selected).map(item => item.id);
        this.selectedFilter.networkIds = this.filterObj['networkList'] && this.filterObj['networkList'].filter(item => item.selected).map(item => item.id);
        this.currCondition = '';
        this.conditionTitle.forEach(item => item.isActive = false);
        setTimeout(() => {
          this.getSeletedBarHeight()
        }, 50)
        this.getProductList()
      },
      // 选中栏高度
      getSeletedBarHeight() {
        let rootFontSize = document.querySelector('html').style.fontSize.slice(0, -2);
        let height = this.$refs.selectedBar.offsetHeight || 0;
        this.selectedBarHeight = Number((height / rootFontSize).toFixed(1));
      }     
    },
    computed:{
      //是否有被选中条件
      hasSelectedCondition() {
        return this.priceOrder.id || this.selectedOrigin.length > 0 || this.selectedRepair.id >= 0 || 
        this.selectedMoreConditions.length > 0;
      },
    }
	}
</script>

<style scoped lang="scss">
  .conditional-search {
    position: fixed;
    top: 1rem;
    left: 0;
    z-index: 3;
    width: 100%;
    background: #fff;
    .searchbar {
      display: flex;
      width: 100%;
      height: 0.8rem;
      line-height: 0.8rem;
      background: #fff;
      border-bottom: 1px solid #f5f5f5;
      .searchbar-item {
        flex: 1;
        text-align: center;
        font-size: 0.28rem;
        color: #666;
        .active {
          color: #353535;
        }
        .disabled {
          color: #999;
        }
        .iconfont {
          font-size: .24rem;
        }
      }
    }
  }
  .selected-condition {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 8px 15px 0 15px;
    background: #fff;
    .s-condition-item {
      position: relative;
      height: 24px;
      line-height: 24px;
      padding: 0 8px;
      margin-right: 10px;
      margin-bottom: 8px;
      color: #999;
      font-size: 12px;
      border-radius: 4px;
      border: 1px solid #e5e5e5;
      .times {
        display: inline-block;
        margin-top: -4px;
        vertical-align: middle;;
        font-size: 16px;
        font-style: normal;
      }
    }
  }
  .condition-content {
    position: absolute;
    top: 1.8rem;
    z-index: 2;
    width: 100%;
    background: #fff;
    .c-content-body {
      position: fixed;
      // top: 0;
      z-index: 3;
      width: 100%;
      background: #fff;     
    }
    .s-content-list {
      display: flex;
      justify-content: center;
      padding: 5px 15px;
      .c-content-item {
        flex: 1;
        padding: 5px;
        margin: 5px;
        text-align: center;
        border-radius: 5px;
        border: 1px solid #e5e5e5;
        &.active {
          color: #000;
          background: #f3c91e;
          border: 0;
        }
      }
    }
  } 
  .conditions-more-body {
    position: absolute;
    top: 0;
    z-index: 2;
    width: 100%;
    margin-bottom: 30px;
    background: #fff;
    .condition-more-list {
      padding: 10px;
      margin-bottom: 10px;
      .condition-more-item {
        margin: 10px 0;
        &:first-child {
          margin-top: 0;
        }
      }
      .condition-item-name {
        font-size: .28rem;
        font-weight: bold;
      }
      .item-options {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        .condition-option-item {
          width: 30%;
          padding: 5px;
          margin-right: 0.2rem;
          margin-bottom: 0.2rem;
          text-align: center;
          border-radius: 5px;
          border: 1px solid #e5e5e5;
          &:nth-child(3n) {
            margin-right: 0;
          }
          &.active {
            font-weight: bolder;
            background: #f3c91e;
            border: 1px solid #f3c91e;
          }
        }
      }
    }
    .m-selection-button {
      position: fixed;
      bottom: 0;
      z-index: 99;
      display: flex;
      width: 100%;
      button {
        flex:1;
        padding: 10px;
        border: 0;
        font-size: 15px;
        outline: none;
      }
      .reset-button {
        background: #ddd;
      }
      .confirm-button {
        background: #f3c91e;
      }
    }
  }
  .condition-body-mask {
    position: fixed;
    top: 1.8rem;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background: rgba(0,0,0,.5);
  }
  .not-found {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
    padding: .3rem;
    text-align: center;
  }
  .product-box {
    position: relative;
    top: 1.8rem;
    // padding-bottom: .4rem;
    .product-list {
      padding: .1rem .3rem;
      .product-item {
        padding: .1rem .2rem;
        margin: .2rem 0;
        border-radius: 8px;
        box-shadow: 1px 3px 6px -3px #ddd;
        // box-shadow: 0 0 5px 1px #eee;
        background: #fff;
        .item-link {
          display: flex;
        }
        .product-pic {
          width: 2rem;
          img {
            width: 100%;
          }
        }
        .product-detail {
          flex: 1;
          padding-left: .2rem;
          .product-name {
            // display: flex;
            height: 1rem;
            overflow: hidden;
            padding-top: .14rem;
            margin-bottom: .01rem;
            font-weight: bolder;
            line-height: 1.6;
            .item-chengse {
              width: 1rem;
              height: .36rem;
              margin-right: .1rem;
              padding: .1rem .12rem .06rem;
              border-radius: .2rem;
              font-size: .2rem;
              position: relative;
              top: -0.04rem;
            }
            .item-name {
              font-size: .28rem;
            }
          }
          .product-tag {
            .tag-list {
              display: flex;
              flex-wrap: wrap;
              margin-top: .04rem;
              .tag-item {
                height: .36rem;
                padding: 0.02rem .14rem 0;
                line-height: .36rem;
                margin: 0 .1rem .1rem 0;
                font-size: .2rem;
                border-radius: .08rem;
                background: #fff8d0;
                // border: 1px solid #f3c91e;
                &:last-child {
                  margin-right: 0;
                }
              }
            }
          }
          .product-price {
            display: flex;
            justify-content: space-between;
            margin-top: .3rem;
            .current-price {
              font-size: .36rem;
              font-weight: bolder;
              .font-rmb {
                font-size: .24rem;
              }
            }
            .original-price {
              margin-left: .1rem;
              text-decoration: line-through;
            }
            .save {
              display: flex;
              width: 1.28rem;
              height: .38rem;
              line-height: .38rem;
              padding: 0;
              border-radius: .08rem;
              border:1px solid #eb2828;
              overflow: hidden;
              .s-text {
                position: relative;
                top: -0.01rem;
                left: -0.01rem;
                display: inline-block;
                height: .38rem;
                line-height: .38rem;
                padding: 0 .08rem;
                color: #fff;
                font-size: .2rem;
                font-weight: normal;
              }
              .s-amount {
                display: inline-block;
                height: 100%;
                padding-left: .06rem;
                font-size: .22rem;
              }
            }
          }
        }
      }
    }
  }
  .mint-loadmore {
    overflow: visible;
  }
  .mint-loadmore-bottom {
    height: .6rem;
    line-height: .6rem;
    margin-bottom: .2rem;
  }
</style>
