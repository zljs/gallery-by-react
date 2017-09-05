require('normalize.css/normalize.css');
require('styles/App.scss');
import ReactDOM from 'react-dom';
import React from 'react';

// let yeomanImage = require('../images/yeoman.png');
//获取图片相关数据
let imageDatas = require('../data/imageData.json');
// 利用自执行函数，将图片名信息转换成URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
    for (let i = 0, j = imageDatasArr.length; i < j; i++) {
        let singleImageData = imageDatasArr[i];

        singleImageData.imageURL = require('../images/' + singleImageData.fileName)

        imageDatasArr[i] = singleImageData;
    }
    return imageDatasArr;
})(imageDatas)

//获取区间内的一个随机值
let getRangRandom = (low, high) => {
        return Math.ceil(Math.random() * (high - low) + low);
    }
    // 限制旋转角度0-30 任意正负值
let get30DegRandom = () => {
    return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
}
class ImgFigure extends React.Component {
    /*
     *imgFigure的点击处理函数
     */
    handleClick = (e) => {
        this.props.inverse();
        // console.log(this.props.arrange.isInverse)

        e.stopPropagation();
        e.preventDefault();
    }
    render() {
        let styleObj = {};

        //如果props属性中指定了这张图片的位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        //如果图片的旋转角度有值，则添加
        if (this.props.arrange.rotate) {
            (['MozT', 'msT', 'OT', 'WebkitT', 't']).forEach(
                (value) => styleObj[value + 'ransform'] = 'rotate(' + this.props.arrange.rotate + 'deg)'
            );

        }
        var imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : ' ';
        return ( < figure className = {
                imgFigureClassName
            }

            style = {
                styleObj
            }
            onClick = {
                this.handleClick
            } >
            < img src = {
                this.props.data.imageURL
            }
            alt = {
                this.props.data.title
            }
            /> < figcaption > < h2 className = "img-title" > {
            this.props.data.title
        } < /h2> < div className = 'img-back'
        onClick = {
                this.handleClick
            } >
            <p>{this.props.data.desc}</p> < /div> < /figcaption > < /figure>
    )
}
}
//搭建舞台
class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgsArrangeArr: []
        }

    }
    Constant = {
        centerPos: {
            left: 0,
            right: 0
        },
        hPosRange: { //水平方向的取值范围
            leftSecX: [0, 0],
            rightSecX: [0, 0],
            y: [0, 0]
        },
        vPosRange: { //垂直方向的取值范围
            x: [0, 0],
            topY: [0, 0]
        }
    }

    /*
     *翻转图片
     *@param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
     *return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
     */
    inverse(index) {
            return function() {
                let imgsArrangeArr = this.state.imgsArrangeArr;

                imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

                this.setState({
                    imgsArrangeArr: imgsArrangeArr
                })
            }.bind(this)
        }
        /*
         *重新布局所有图片
         *@param centerIndex 指定居中排布哪个图片
         */

    rearrange(centerIndex) {
            let imgsArrangeArr = this.state.imgsArrangeArr,
                Constant = this.Constant,
                centerPos = Constant.centerPos,
                hPosRange = Constant.hPosRange,
                vPosRange = Constant.vPosRange,
                hPosRangeLeftSecX = hPosRange.leftSecX,
                hPosRangeRightSecX = hPosRange.rightSecX,
                hPosRangeY = hPosRange.y,
                vPosRangeTopY = vPosRange.topY,
                vPosRangeX = vPosRange.x,

                imgsArrangeTopArr = [],
                topImgNum = Math.ceil(Math.random() * 2), //娶一个或不取
                topImgSpliceIndex = 0,
                // 存放居中图片的状态信息
                imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

            //首先居中centerIndex的图片
            imgsArrangeCenterArr[0].pos = centerPos;

            // 居中的centerINdex图片不需要旋转
            imgsArrangeCenterArr[0].rotate = 0;

            // 取出要布局上侧的图片的状态信息
            topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
            imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
            // 布局位于上侧的图片
            imgsArrangeTopArr.forEach((value, index) => {
                imgsArrangeTopArr[index] = {
                    pos: {
                        top: getRangRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                        left: getRangRandom(vPosRangeX[0], vPosRangeX[1])
                    },
                    rotate: get30DegRandom()
                };

            });

            // 布局左右两侧的图片
            for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
                let hPosRangeLORX = null;

                // 前半部分布局左边，右半部分布局右边
                if (i < k) {
                    hPosRangeLORX = hPosRangeLeftSecX;
                } else {
                    hPosRangeLORX = hPosRangeRightSecX;
                }

                imgsArrangeArr[i] = {
                    pos: {
                        top: getRangRandom(hPosRangeY[0], hPosRangeY[1]),
                        left: getRangRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                    },
                    rotate: get30DegRandom()
                }
            }

            if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
                imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
            }

            imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            })
        }
        //es6不支持getInitialState写法，使用constructor(props)定义this.state
        /*    getInitialState() {
                    return {
                        imgsArrangeArr: [
                            // {
                            //     pos:{
                            //         left:'0',
                            //         top:'0'
                            //     },
                            //     rotate:0,  //旋转角度
                            //     isInverse:false   //图片正反面
                            // }
                        ]
                    }
                }*/
        // 组件加载以后，为每张图片计算其位置范围
    componentDidMount() {
        //首先拿到舞台大小
        let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        // 拿到一个imgFigure的大小
        let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);

        // 计算中心图片的位置点
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }

        // 计算左侧，右侧区域排布位置的取值范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        // 计算上侧区域排布位置的取值范围
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0);

    }
    render() {
        let controllerUnits = [],
            imgFigures = [];

        imageDatas.forEach((value, index) => {
                if (!this.state.imgsArrangeArr[index]) {
                    this.state.imgsArrangeArr[index] = {
                        pos: {
                            left: 0,
                            top: 0
                        },
                        rotate: 0,
                        isInverse: false
                    }
                }
                imgFigures.push( < ImgFigure data = {
                        value
                    }
                    ref = {
                        'imgFigure' + index
                    }
                    key = {
                        index
                    }
                    arrange = {
                        this.state.imgsArrangeArr[index]
                    }
                    inverse = {
                        this.inverse(index)
                    }
                    />)
                });

            return ( < section className = "stage"
                ref = "stage" >
                < section className = "img-sec" > {
                    imgFigures
                } < /section> < nav className = "controller-nav" > {
                controllerUnits
            } < /nav> < /section >
        );
    }
}

AppComponent.defaultProps = {};

export default AppComponent;
