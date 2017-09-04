require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// let yeomanImage = require('../images/yeoman.png');
//获取图片相关数据
let imageDatas = require('../data/imageData.json');
// 利用自执行函数，将图片名信息转换成URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
    for (let i = 1; i < imageDatasArr.length; i++) {
        let singleImageData = imageDatasArr[i];

        singleImageData.imageURL = require('../images/' + singleImageData.fileName)

        imageDatasArr[i] = singleImageData;
    }
    return imageDatasArr;
})(imageDatas)

class ImgFigure extends React.Component {
        render() {
            return (
                <figure className="img-figure">
                    <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                    <figcaption>
                        <h2 className="img-title">
                            {this.props.data.desc}
                        </h2>
                    </figcaption>
                </figure>
            )
        }
    }
    //搭建舞台
class AppComponent extends React.Component {
    render() {
        let controllerUnits = [],
            imgFigures = [];

        imageDatas.forEach(function(value) {
            imgFigures.push(<ImgFigure data={value}/>)
        });

        return (
            <section className="stage">
                <section className = "img-sec">
                    {imgFigures}
                </section> < nav className = "controller-nav" > {
                controllerUnits
            } < /nav> < /section >
        );
    }
}

AppComponent.defaultProps = {};

export default AppComponent;
