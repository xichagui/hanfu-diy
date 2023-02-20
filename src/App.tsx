import React, {useEffect, useRef} from 'react'
import './App.css'
import {fabric} from 'fabric';
import {Button, Upload} from 'antd'
import {Image} from "fabric/fabric-impl";


function App() {
  const canvasEl = useRef<HTMLCanvasElement>(null)
  let canvas: fabric.Canvas | undefined = undefined

  useEffect(() => {
    const options = {
      width: 500,
      height: 500,
      stopContextMenu: true,
      backgroundColor: '#eeeeee',
    };

    canvas = new fabric.Canvas(canvasEl.current, options);

    return () => {
      canvas = undefined
    }
  })


  const newCanvasFromUpload = (prop: any) => {
    console.log(prop)
    // const objectURL = URL.createObjectURL(prop.target.files[0]);
    // const objectURL = URL.createObjectURL(prop.file);
    // const img = new Image();
    // img.src = objectURL;

    // const filePath = prop.target.value
    // const fileName = prop.target.files[0].name
    // const file = prop.target.files[0]
    const file = prop.file
    // const extn = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()

    if (window.FileReader) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = (e) => {
        const base64String = e!.target!.result as string
        fabric.Image.fromURL(base64String, (oImg) => {

          canvas!.setWidth(oImg.width as number / 10)
          canvas!.setHeight(oImg.height as number / 10)

          const bg = new fabric.Rect({
            width: oImg.width as number / 10,
            height: oImg.height as number / 10,
            fill: 'white',
            evented: false,
            selectable: false
          });
          bg.canvas = canvas
          canvas!.backgroundImage = bg as Image;
          // canvasContext.canvas.renderAll()

          canvas!.setOverlayImage(oImg, canvas!.renderAll.bind(canvas), {
            scaleX: 0.1,
            scaleY: 0.1
          });
          canvas!.renderAll();

        });
      }
    }

  }

  return (
    <div className="App">
      <Upload customRequest={newCanvasFromUpload} showUploadList={false}
              accept="image/png, image/jpeg">
        <Button type="primary" size="small">导入排版新建画布</Button>
      </Upload>
      <canvas id="canvas" ref={canvasEl}/>
    </div>
  )
}

export default App
