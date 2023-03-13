import React, {useEffect, useRef, useState} from 'react'
import './App.css'
import {fabric} from 'fabric';
import {Button, Upload} from 'antd'
import {Stage, Layer, Image as Img, Transformer} from "react-konva";
import Konva from "konva";
import {Canvas} from "fabric/fabric-impl";

const canvasContext : {[key: string]: Canvas|null} = {'canvas': null}

function App() {
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef(null)
  const [fabricState, setFabricState] = useState<Canvas>()
  // const canvasEl2 = useRef<HTMLCanvasElement>(null)
  // const canvas = useRef<HTMLCanvasElement>(null)
  // const stateRef = useRef<Konva.Stage>(null)
  const [partList, setPartList] = useState<Array<HTMLCanvasElement|HTMLImageElement>>([])

  // const initFabric = () => {
  //   canvasContext.canvas = new fabric.Canvas(canvasEl.current);
  // }

  useEffect(() => {
    // canvas.current = initCanvas();
    const options = {
      width: 500,
      height: 500,
      stopContextMenu: true,
      // backgroundColor: '#eeeeee',
    };

    canvasContext.canvas = new fabric.Canvas(canvasEl.current, options);
    //
    // return () => {
    //   canvas = undefined
    // }

    // stateRef.current!.width(1500)
    // stateRef.current!.height(1500)

    // stateRef.current!.on('click tap', (e)=>{
    //   if (e.target === stateRef.current) {
    //     stateRef.current!.find('Transformer').destroy();
    //   }
    // })
    canvasContext.canvas.add(new fabric.Rect({top:50, left:50, width:50, height:50, fill:"red"}))

  }, [])
  //
  // useEffect(()=> {
  //   fabricState?.add(new fabric.Rect({top:50, left:50, width:50, height:50, fill:"red"}))
  // }, [fabricState])

  const newCanvasFromUpload = (prop: any) => {
    console.log(prop)
    const canvas = canvasEl!.current
    const ctx = canvas!.getContext('2d');
    const file = prop.file
    // const extn = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
    if (window.FileReader) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = (e) => {
        const url = reader.result as string;
        let img = new Image();
        img.src = url;
        img.onload = () => {
          canvas!.width = img.width;
          canvas!.height = img.height;
          // ctx!.drawImage(img, 0, 0)
          // divideClothes()
        }
      }
    }
  }

  const divideClothes = () => {
    const canvas = canvasEl!.current
    const ctx = canvas!.getContext('2d');
    const imageData = ctx!.getImageData(0, 0,canvas!.width,canvas!.height).data
    const colorDict : {[key: string]: Array<number>} = {}
    for (let i = 0; i < canvas!.width * canvas!.height * 4; i += 4) {
      let r = imageData[i], g = imageData[i + 1], b = imageData[i + 2], a = imageData[i + 3];
      const colorString = `${r},${g},${b},${a}`
      if (a != 0) {
        if (colorString in colorDict) {
          colorDict[colorString].push(i)
        } else {
          colorDict[colorString] = [i]
        }
      }
    }

    // ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
    let tempPartList : Array<HTMLCanvasElement|HTMLImageElement> = []

    for (let key in colorDict) {
      const newImageDate = new ImageData(canvas!.width, canvas!.height)
      const newCanvas = document.createElement('canvas')
      newCanvas.width = canvas!.width;
      newCanvas.height = canvas!.height;
      for (let i = 0; i < colorDict[key].length; i++) {
        let pos = colorDict[key][i]
        let [strR, strG, strB, strA] = key.split(',');
        newImageDate.data[pos] = parseInt(strR);
        newImageDate.data[pos + 1] = parseInt(strG);
        newImageDate.data[pos + 2] = parseInt(strB);
        newImageDate.data[pos + 3] = parseInt(strA);
      }
      newCanvas.getContext('2d')!.putImageData(newImageDate,0,0)
      tempPartList.push(newCanvas)
    }

    setPartList(tempPartList)
    // let layer = new Konva.Layer()
    // for (let i = 0; i < tempPartList.length; i++) {
    //   let partImage = new Konva.Image({
    //     x: 0,
    //     y: 0,
    //     image: tempPartList[i],
    //     width: canvas!.width,
    //     height: canvas!.height,
    //     // draggable: true,
    //     // globalCompositeOperation: 'xor'
    //   });
    //   layer.add(partImage);
    // }
    // stateRef.current!.add(layer)
  }

  return (
    <div className="App">
      <Upload customRequest={newCanvasFromUpload} showUploadList={false}
              accept="image/png, image/jpeg">
        <Button type="primary" size="small">导入排版新建画布</Button>
      </Upload>
      <canvas id="canvas" ref={canvasEl}/>
      {/*<Stage ref={stateRef}>*/}
        {/*<Layer>*/}
        {/*</Layer>*/}
        {/*{partList.map((canvas, index) => {*/}
        {/*  return <Layer key={index}><Img image={canvas}/></Layer>*/}
        {/*})}*/}
      {/*</Stage>*/}
    </div>
  )
}

export default App
