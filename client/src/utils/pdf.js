import html2canvas from 'html2canvas'
import jspdf from 'jspdf'

/**
 *  @param elId 打印的节点ID
 */
export async function getCanvasByHtmlId(elId) {
  let canvas = await html2canvas(document.getElementById(elId), {
    scale: 1,
    useCORS: true,
    allowTaint: true,
    taintTest: false,
    imageTimeout: 0
  }).then(canvas => {
    return canvas;
  });

  return canvas;
}


/**
 *  @param htmlCanvas canvas对象
 */
export function canvasToPdf(htmlCanvas) {
  let canvasWidth = htmlCanvas.width;
  let canvasHeight = htmlCanvas.height;
  let imgBase64 = htmlCanvas.toDataURL("image/jpeg", 1.0);

  //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
  let imgWidth = 595.28;
  //图片高度需要等比缩放
  let imgHeight = 595.28 / canvasWidth * canvasHeight;
  console.log(canvasWidth, canvasHeight, imgWidth, imgHeight)
  let pageHeight = imgHeight; //pdf转化后页面总高度
  let position = 0;

  let pdfInstance = new jspdf("", "pt", "a4");
  pdfInstance.setFontSize(16);

  if (imgHeight < 841.89) {
    pdfInstance.addImage(imgBase64, "JPEG", 0, 0, imgWidth, imgHeight);
  } else {
    while (pageHeight > 0) {
      pdfInstance.addImage(imgBase64, "JPEG", 0, position, imgWidth, imgHeight);
      pageHeight -= 841.89;
      position -= 841.89;
      if (pageHeight > 0) {
        pdfInstance.addPage();
      }
    }
  }

  return pdfInstance;
}

export function downPdf(pdfInstance, title) {
  // 文件名过长导致下载失败
  if (title.length > 50) {
    title = title.substring(title.length - 50);
  }

  pdfInstance.save(title + ".pdf", { returnPromise: true }).then(function() {
    //搜狗浏览器下载机制问题暂时不关闭
    if (!(navigator.userAgent.toLowerCase().indexOf("se 2.x") > -1)) {
      setTimeout(window.close, 300);
    }
  });
}
