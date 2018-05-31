import React, { Component } from 'react';
import {  
    View,
    Text,
    processColor,
    StyleSheet,
	ScrollView,
	TouchableOpacity
} from 'react-native';
import update from 'immutability-helper';
import {PieChart, LineChart} from 'react-native-charts-wrapper';
import { ScreenScale } from '../../Constants';
import { getTeamInfo, getTeamStatistic } from '../../network/Service';
import Toast from '../../utils/Toast';

export default class TeamScreen extends Component {
    static navigationOptions = () => {
        return {
          tabBarVisible: false,
          title: "我的团队",
        };
	}
	constructor(props) {
		super(props);

		this.state = {
			teamLegend: {
			  enabled: true,
			  textSize: 12,
			  form: 'square',
			  horizontalAlignment: 'center',
			  wordWrapEnabled: false
			},
			orderLegend: {
				enabled: false,
			},
			styledCenterText: {
				text:'0人', color: processColor('#333333'), size: 20
			},
			teamData: {
			  dataSets: [{
				values: [
				  {value: 101, label: '代理 0人'},
				  {value: 19, label: '运营总监 0人'}],
				label: '',
				config: {
				  colors: [processColor('#C7B797'), processColor('#574623')],
				  valueTextSize: 0,
				  sliceSpace: 0,
				  selectionShift: 0
				}
			  }],
			},
			orderData:{},
			revenueData:{},
			description: {
				text: 'chart description',
				textSize: 0,
				textColor: processColor('white'),
			},
			xAxis: {
				enabled: true,
				position: 'BOTTOM',
				drawAxisLine: false,
				drawGridLines: false,
				centerAxisLabels: true,
				textColor: processColor('#999999'),
				textSize: 11,
				labelCount: 7,
				labelCountForce: true,
				valueFormatter: 'date',
				valueFormatterPattern: 'HH:mm'
			},
			yAxis:{
				left: {
					enabled: true,
					drawAxisLine: false,
					textColor: processColor('#888888'),
					textSize: 12,
					gridLineWidth: 1,
					gridColor: processColor('#D8D8D8'),
					labelCount: 5,
					labelCountForce: true,
				},
				right: {
					enabled: false,
				}
			},
			dateIndex:1,
			todayRegisters: 0,
			yesterdayRegisters: 0,
			directlyAffiliatedMembers: 0,
			unDirectlyAffiliatedMembers: 0,

			teamOrderTotalNum: 0,//团队订单数
			teamTotalIncome: 0,	//团队贡献收入数
		};
	}
	// data=[{x: 1, y: 0.88}, {x: 2, y: 0.77}, {x: 3, y: 105}, {x: 4, y: 115}, {x: 4, y: 115}, 
	// 	{x: 5, y: 115}, {x: 6, y: 115}, {x: 7, y: 115}, {x: 8, y: 115},{x: 17, y: 0.77}, {x: 18, y: 115}, ];
	componentWillUnmount() {
		console.log("TeamScrenn will unmount");
	}
	componentDidMount() {
		this.fetchData();
		this.fetchOrderStatistic(1);
		this.setState(
		  update(this.state, {
			orderData: {
				$set: {
					dataSets: [{
					values: [{x:0, y:0}],
					label: 'aa',
					config: {
						lineWidth: 1,
						drawCircles: true,
						drawCircleHole: true,
						circleRadius: 3,
						circleHoleRadius: 2,
						circleHoleColor:processColor('white'),
						circleColor:processColor('#E9797A'),
						highlightColor: processColor('#E9797A'),
						color: processColor('#E9797A'),
						drawFilled: false,
						valueTextSize: 0,
					}
				}],
			  }
			},
		  })
		);
		this.setState(
			update(this.state, {
				revenueData: {
					$set: {
						dataSets: [{
						values: [{x:0, y:0}],
						label: 'aa',
						config: {
							lineWidth: 1,
							drawCircles: true,
							drawCircleHole: true,
							circleRadius: 3,
							circleHoleRadius: 2,
							circleHoleColor:processColor('white'),
							circleColor:processColor('#E9797A'),
							highlightColor: processColor('#E9797A'),
							color: processColor('#E9797A'),
							drawFilled: false,
							valueTextSize: 0,
						}
					}],
				  }
				},
			  })
		);
	}
	fetchData = () => {
		getTeamInfo().then((response) => {
			this.setState(update(this.state, {
				styledCenterText: {
					// $merge: {text:`9999`}
					$merge: {text:`${response.entry.teamTotalNum}`}
				},
				teamData: {
					$set: {
						dataSets: [{
						values: [
							{value: response.entry.agents, label: `代理${response.entry.agents}人`},
							{value: response.entry.operatingOfficers, label: `运营总监${response.entry.operatingOfficers}人`}],
						label: '',
						config: {
							colors: [processColor('#C7B797'), processColor('#574623')],
							valueTextSize: 0,
							sliceSpace: 0,
							selectionShift: 0
						}
						}],
					}
				},
			}));
			this.setState({
				todayRegisters: response.entry.todayRegisters,
				yesterdayRegisters: response.entry.yesterdayRegisters,
				directlyAffiliatedMembers: response.entry.directlyAffiliatedMembers,
				unDirectlyAffiliatedMembers: response.entry.unDirectlyAffiliatedMembers,
			});
		})
		.catch((err)=>{
			Toast.show(err.message, Toast.LONG);
		});
	}
	fetchOrderStatistic = (type)=>{
		getTeamStatistic(type).then((response)=>{
			this.setState({
				teamOrderTotalNum: response.entry.teamOrderTotalNum,
				teamTotalIncome:response.entry.teamTotalIncome, 

			});
			let values = response.entry.teamOrderStatisticsList.map((item)=>{return {x:item.date*1000, y: parseFloat(item.value)};});
			let revValues = response.entry.teamIncomeStatisticsList.map((item)=>{return {x:item.date*1000, y: parseFloat(item.value)};});
			this.setState(
				update(this.state, {
					orderData: {
						$set: {
							dataSets: [{
							values: values,
							label: 'aa',
							config: {
								lineWidth: 1,
								drawCircles: true,
								drawCircleHole: true,
								circleRadius: 3,
								circleHoleRadius: 2,
								circleHoleColor:processColor('white'),
								circleColor:processColor('#E9797A'),
								highlightColor: processColor('#E9797A'),
								color: processColor('#E9797A'),
								drawFilled: false,
								valueTextSize: 0,
							}
							}],
						}
					},
				  	xAxis: {
						$set: {
							enabled: true,
							position: 'BOTTOM',
							drawAxisLine: false,
							drawGridLines: false,
							centerAxisLabels: true,
							textColor: processColor('#999999'),
							textSize: 11,
							labelCount: 7,
							labelCountForce: true,
							valueFormatter: 'date',
							valueFormatterPattern: this.state.dateIndex < 3?'HH:mm' : 'dd日'}
					},
				})
			);
			this.setState(
				update(this.state, {
				  revenueData: {
					  $set: {
						  dataSets: [{
						  values: revValues,
						  label: 'aa',
						  config: {
							  lineWidth: 1,
							  drawCircles: true,
							  drawCircleHole: true,
							  circleRadius: 3,
							  circleHoleRadius: 2,
							  circleHoleColor:processColor('white'),
							  circleColor:processColor('#E9797A'),
							  highlightColor: processColor('#E9797A'),
							  color: processColor('#E9797A'),
							  drawFilled: false,
							  valueTextSize: 0,
						  }
					  }],
					}
				  },
				})
			);
		})
		.catch((err)=>{
			Toast.show(err.message, Toast.LONG);
		});
	}
    renderPie = () => {
        return (
            <PieChart
                style={{ left:0, right: 0, height: 130,}}
                chartBackgroundColor={processColor('white')}
                chartDescription={this.state.description}
                data={this.state.teamData}
                legend={this.state.teamLegend}
                entryLabelColor={processColor('black')}
                entryLabelTextSize={20}
                drawEntryLabels={false}
                rotationAngle={45}
                styledCenterText={this.state.styledCenterText}
                centerTextRadiusPercent={100}
                holeRadius={70}
                holeColor={processColor('#f0f0f0')}
                transparentCircleRadius={0}
                transparentCircleColor={processColor('#f0f0f088')}
                maxAngle={365}
                onSelect={()=>{}}
                onChange={(event) => {}}
            />
        );
	}
	renderLineChartOrder = (type)=>{
		let datas = type ===0 ? this.state.orderData: this.state.revenueData;
		return (
			<View style={{flex:1,padding:10, backgroundColor:'white'}}>
			<LineChart
				style={{ left:0, right: 0, height: 130}}
				data={datas}
				chartDescription={{text: ''}}
				legend={this.state.orderLegend}
				xAxis={this.state.xAxis}
				yAxis={this.state.yAxis}
				drawGridBackground={false}
				drawBorders={false}

				touchEnabled={false}
				dragEnabled={false}
				scaleEnabled={false}
				scaleXEnabled={false}
				scaleYEnabled={false}
				pinchZoom={false}
				doubleTapToZoomEnabled={false}
				dragDecelerationEnabled={false}
				keepPositionOnRotation={false}
				onChange={(event) => console.log(event.nativeEvent)}
          />
		  </View>
		);
	}
    renderCountItem = (type)=>{
		let title='今日注册';
		let count = this.state.todayRegisters;
        switch (type) {
            case 0:
            title = "今日注册";break;
            case 1:
            title = "昨日注册";count=this.state.yesterdayRegisters;break;
            case 2:
            title = "直属下属";count=this.state.directlyAffiliatedMembers;break;
            case 3:
            title = "非直属下属";count=this.state.unDirectlyAffiliatedMembers;break;
            default:break;
        }
        return (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 21, color:'black', marginBottom:15}}>{count}</Text>
                <Text style={{fontSize: 12, color:'black'}}>{title}</Text>
            </View>
        );
	}
	renderDateTitle = (activeIndex)=>{
		return (
			<View style={{marginTop: 15, marginBottom:15, height: 45, backgroundColor: 'white', flexDirection: 'row',  justifyContent:'space-around', alignItems: 'stretch'}}>
				<View style={{flexDirection: 'row',  }}>
					<TouchableOpacity activeOpacity={0.6} onPress={()=>{this.setState({dateIndex:1});this.fetchOrderStatistic(1);}} style={{flexDirection: 'row',  }}>
						<Text style={activeIndex === 1 ?{color: '#D12129', alignSelf:'center'}:{color: '#444444', alignSelf:'center'}}>今日</Text>
						{activeIndex === 1?<View style={{position:'absolute', bottom:0, height:2, width:28,  backgroundColor:'#D12129'}}/>:null}
					</TouchableOpacity>
				</View>
				
				<View style={{flexDirection: 'row',  }}>
				<TouchableOpacity activeOpacity={0.6} onPress={()=>{this.setState({dateIndex:2});this.fetchOrderStatistic(2);}}  style={{flexDirection: 'row',  }}>
					<Text style={activeIndex === 2 ?{color: '#D12129', alignSelf:'center'}:{color: '#444444', alignSelf:'center'}}>昨日</Text>
					{activeIndex === 2?<View style={{position:'absolute', bottom:0, height:2, width:28, backgroundColor:'#D12129'}}/>:null}
				</TouchableOpacity>
				</View>
				<View style={{flexDirection: 'row',  }}>
				<TouchableOpacity activeOpacity={0.6} onPress={()=>{this.setState({dateIndex:3});this.fetchOrderStatistic(3);}}  style={{flexDirection: 'row',  }}>
					<Text style={activeIndex === 3 ?{color: '#D12129', alignSelf:'center'}:{color: '#444444', alignSelf:'center'}}>本月</Text>
					{activeIndex === 3?<View style={{position:'absolute', bottom:0, height:2, width:28, backgroundColor:'#D12129'}}/>:null}
				</TouchableOpacity>
				</View>
				<View style={{flexDirection: 'row',  }}>
				<TouchableOpacity activeOpacity={0.6} onPress={()=>{this.setState({dateIndex:4});this.fetchOrderStatistic(4);}}  style={{flexDirection: 'row',  }}>
					<Text style={activeIndex === 4 ?{color: '#D12129', alignSelf:'center'}:{color: '#444444', alignSelf:'center'}}>上月</Text>
					{activeIndex === 4?<View style={{position:'absolute', bottom:0, height:2, width:28, backgroundColor:'#D12129'}}/>:null}
				</TouchableOpacity>
				</View>

			</View>
		);
	}

    render() {
        return (
			<ScrollView>
				<View style={{flex: 1}}>
					<View style={{height: 50, backgroundColor: 'white', marginTop: 20}}>
						<Text style={{color:'black', fontSize:15, fontWeight:'bold', marginTop:10,marginLeft: 15}}>我的团队</Text>
					</View>
					{this.renderPie()}
					<View>
						<View style={{backgroundColor: 'white', height:15, left:0,right:0}}></View>
						<View style={{backgroundColor:'#CCCCCC', height:1/ScreenScale, left:0,right:0}}></View>
						<View style={{flexDirection: 'row', backgroundColor: "white", justifyContent:'space-around', alignItems:'center', height: 86}}>
							{this.renderCountItem(0)}
							{this.renderCountItem(1)}
							{this.renderCountItem(2)}
							{this.renderCountItem(3)}
						</View>
					</View>
					{this.renderDateTitle(this.state.dateIndex)}
					<View style={{flex:1, backgroundColor:'white', height:106, }}>
						<Text style={{color:'#333333',fontSize:16, marginLeft: 10, marginTop:20}}>团队订单</Text>
						<Text style={{color:'#333333',fontSize:28, marginLeft: 10, marginTop:15}}>{this.state.teamOrderTotalNum}</Text>
					</View>
					{this.renderLineChartOrder(0)}
					<View style={{flex:1, backgroundColor:'white', height:106, marginTop: 20}}>
						<Text style={{color:'#333333',fontSize:16, marginLeft: 10, marginTop:20}}>团队贡献收入</Text>
						<Text style={{color:'#333333',fontSize:28, marginLeft: 10, marginTop:15}}>{this.state.teamTotalIncome}</Text>
					</View>
					{this.renderLineChartOrder(1)}
					<View style={{flex:1, height:20}}></View>
				</View>
			</ScrollView>
        );
    }
}
