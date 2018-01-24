// [
// 	{
// 		id: { type: string }, //唯一id
// 		name: { type: string }, //主题名字
// 		avatar: { type: string }, //版面图
// 		description: { type: string }, //详情
// 		selected: { type: boolean }, //是否选择的主题
// 		selectTime: { type: string }, //选择的时间
// 		updateTime: { type: string }, //更新的时间
// 		categories: [
// 			{
// 				id: { type: string }, //唯一id
// 				name: { type: string }, //收藏夹名字
// 				collects: { type: number }, //被收集的总量
// 				collected: { type: boolean }, //是否收藏的收藏夹
// 				avatar: { type: string }, //版面图
// 				by: { type: string }, // 创建者
// 				description: { type: string }, //详情
// 				collectTime: { type: string }, //收藏的时间
// 				updateTime: { type: string }, //更新的时间
// 				sites: [
// 					{
// 						id: { type: string }, //唯一id
// 						name: { type: string }, //网址名
// 						url: { type: string }, //网址url
// 						content: { type: string }, //网址内容
// 						description: { type: string }, //详情
// 						icon: { type: string }, //网址logo
// 						liked: { type: boolean }, //是否喜欢的网址
// 						likeTime: { type: string }, //喜欢的时间
// 						updateTime: { type: string }, //更新的时间
// 					}
// 				]
// 			}
// 		]
// 	}
// ]

export const mockData = [
	{
		"id": "81",
		"sort": 1,
		"name": "BT资源下载",
		"avatar": "",
		"description": "",
		"selectTime": "",
		"updateTime": "",
		"categories": [
			{
				"sort": 1,
				"id": "530",
				"name": "BT磁链",
				"avatar": "static/img/avatar/BT.png",
				"sites": [
					{
						"id": "6900",
						"name": "屌丝搜索",
						"url": "http://www.diaosisou.com/",
						"icon": "",
						"description": "",

					},
					{
						"id": "10797",
						"name": "蜘蛛磁力",
						"url": "http://www.zhizhu88.com/",
						"icon": "",
						"description": "",

					},
					{
						"id": "7410",
						"name": "磁力爸爸",
						"url": "http://www.cilibaba.me/",
						"icon": "",
						"description": "",

					},
					{
						"id": "9865",
						"name": "BT搜搜",
						"url": "http://www.btyunsou.com/",
						"icon": "",
						"description": "",

					},
					{
						"id": "9221",
						"name": "TorrentKitty",
						"url": "http://www.torrentkitty.cn/",
						"icon": "",
						"description": "",

					},
					{
						"id": "3479",
						"name": "种子搜",
						"url": "http://www.zhongziso.com/",
						"icon": "",
						"description": "",

					},
					{
						"id": "9602",
						"name": "BT之家",
						"url": "http://www.btjia.org/",
						"icon": "",
						"description": "",

					},
					{
						"id": "2699",
						"name": "查片源",
						"url": "https://www.chapianyuan.com/",
						"icon": "",
						"description": "",

					}
				],
				"by": "猎豹浏览器"
			},
			{
				"sort": 2,
				"id": "818",
				"name": "福利资源",
				"avatar": "static/img/avatar/福利资源.png",
				"sites": [
					{
						"id": "4596",
						"name": "福利吧",
						"url": "http://fuliba.net",
						"icon": "",
						"description": "",

					},
					{
						"id": "6719",
						"name": "美女写真",
						"url": "http://www.xgyw.cc",
						"icon": "",
						"description": "",

					},
					{
						"id": "10283",
						"name": "宅男吧",
						"url": "http://zhainanba.net/",
						"icon": "",
						"description": "",

					},
					{
						"id": "5274",
						"name": "Lu福利",
						"url": "http://www.lufuli.com/",
						"icon": "",
						"description": "",

					},
					{
						"id": "2938",
						"name": "男人装",
						"url": "http://enrz.com/",
						"icon": "",
						"description": "",

					},
					{
						"id": "1339",
						"name": "爱登高福利",
						"url": "http://www.adgao.com/",
						"icon": "",
						"description": "",

					},
					{
						"id": "5858",
						"name": "爱节操",
						"url": "http://www.aijiecao.com/",
						"icon": "",
						"description": "",

					}
				],
				"by": "猎豹浏览器"
			},
			{
				"sort": 3,
				"id": "722",
				"name": "网盘搜索",
				"avatar": "static/img/avatar/网盘搜索.png",
				"sites": [
					{
						"id": "5295",
						"name": "去转盘网",
						"url": "http://www.quzhuanpan.com/",
						"icon": "",
						"description": "",

					},
					{
						"id": "1562",
						"name": "盘搜",
						"url": "http://www.pansou.com/",
						"icon": "",
						"description": "",

					},
					{
						"id": "2462",
						"name": "胖次",
						"url": "https://www.panc.cc/",
						"icon": "",
						"description": "",

					},
					{
						"id": "4977",
						"name": "搜盘网",
						"url": "http://www.soupan.info/",
						"icon": "",
						"description": "",

					},
					{
						"id": "7090",
						"name": "天搜",
						"url": "http://www.daysou.com/",
						"icon": "",
						"description": "",

					},
					{
						"id": "10619",
						"name": "百度云搜",
						"url": "http://www.baiduyunso.com/",
						"icon": "",
						"description": "",

					},
					{
						"id": "3086",
						"name": "网盘屋",
						"url": "http://www.wangpanwu.com/",
						"icon": "",
						"description": "",

					},
					{
						"id": "9378",
						"name": "网盘之家",
						"url": "http://www.wowenda.com/",
						"icon": "",
						"description": "",

					},
					{
						"id": "10964",
						"name": "盘多多",
						"url": "http://www.panduoduo.net/",
						"icon": "",
						"description": "",

					},
					{
						"id": "10592",
						"name": "西林街搜索",
						"url": "http://www.xilinjie.com/",
						"icon": "",
						"description": "",

					},
					{
						"id": "7249",
						"name": "蜘蛛网盘",
						"url": "http://www.zhizhupan.com/",
						"icon": "",
						"description": "",

					}
				],
				"by": "猎豹浏览器"
			}
		]
	},
]
