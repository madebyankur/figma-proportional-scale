var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// 1. Grab current selection (only first one if more nodes are selection)
let selection = figma.currentPage.selection["0"];
let stroke = selection.strokeWeight;
let radius = selection.cornerRadius;
// 2. Show Plugin UI
figma.showUI(__html__, { width: 240, height: 400 });
// 3. Send data to plugin UI
figma.ui.postMessage({
    "objectWidth": selection.width,
    "objectHeight": selection.height,
    "objectStroke": selection.strokeWeight,
    "objectRadius": selection.cornerRadius,
});
// 4. Receive data from plugin UI
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    console.log(msg.stroke);
    if (msg.type == 'resize-by-percentage') {
        selection.resize(Math.round(msg.width * msg.percentageRatio), Math.round(msg.height * msg.percentageRatio));
        selection.strokeWeight = Math.round(stroke * msg.percentageRatio);
        selection.cornerRadius = Math.round(radius * msg.percentageRatio);
    }
    else if (msg.type == 'resize-by-width') {
        selection.resize(Math.round(msg.width * msg.widthRatio), Math.round(msg.height * msg.widthRatio));
        selection.strokeWeight = Math.round(stroke * msg.widthRatio);
        selection.cornerRadius = Math.round(radius * msg.widthRatio);
    }
    else if (msg.type == 'resize-by-height') {
        selection.resize(Math.round(msg.width * msg.heightRatio), Math.round(msg.height * msg.heightRatio));
        selection.strokeWeight = Math.round(stroke * msg.heightRatio);
        selection.cornerRadius = Math.round(radius * msg.heightRatio);
    }
    else {
        figma.closePlugin();
    }
});
// figma.ui.onmessage = msg => {
//     if (msg.type === 'error' === true) {
//       figma.notify(`Whoops! Please enter a value in one of the inputs below. 😔 `)
//     } else {
//     // One way of distinguishing between different types of messages sent from
//     // your HTML page is to use an object with a "type" property like this.
//     msg.type === 'resize-by-percentage' === true ?
//       selection.forEach(node => {
//         selection["0"].resize(Math.round(msg.width * msg.ratioPercentage), Math.round(msg.height * msg.ratioPercentage))
//         selection["0"].strokeWeight = Math.round(msg.stroke * msg.ratioPercentage)
//         selection["0"].cornerRadius = Math.round(msg.radius * msg.ratioPercentage)
//       })
//     : msg.type === 'resizeWidth' === true ?
//       selection.forEach(node => {
//         selection["0"].resize(msg.width, Math.round(msg.height * msg.ratioWidth))
//         selection["0"].strokeWeight = Math.round(msg.stroke * msg.ratioWidth)
//         selection["0"].cornerRadius = Math.round(msg.radius * msg.ratioWidth)
//       })
//     : msg.type === 'resizeHeight' === true ?
//       selection.forEach(node => {
//         selection["0"].resize(Math.round(msg.width * msg.ratioHeight), msg.height)
//         selection["0"].strokeWeight = Math.round(msg.stroke * msg.ratioHeight)
//         selection["0"].cornerRadius = Math.round(msg.radius * msg.ratioHeight)
//       })
//     : msg.type === false
//     figma.closePlugin()
//     figma.notify(`⚡️ Hurray! Your selection has been resized.`)
//     }
//   }
function filterLayers(data, predicate) {
    return !!!data
        ? null
        : data.reduce((list, entry) => {
            let clone = null;
            if (predicate(entry)) {
                clone = entry;
                list.push(clone);
            }
            else if (entry.children != null) {
                let children = filterLayers(entry.children, predicate);
                if (children.length > 0) {
                    list.push(...children);
                }
            }
            return list;
        }, []);
}
