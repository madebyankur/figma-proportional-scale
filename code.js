var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const selection = figma.currentPage.selection;
for (const node of selection) {
    let x = node.findAll((node) => node.x);
    let y = node.findAll((node) => node.y);
    let n = node.findAll((node) => node.width && node.height);
    let radius = node.findAll((node) => node.cornerRadius > 0);
    let stroke = node.findAll((node) => node.strokeWeight > 0);
    // 2. Show Plugin UI
    figma.showUI(__html__, { width: 240, height: 400 });
    // 3. Send data to plugin UI
    figma.ui.postMessage({
        objectWidth: node.width,
        objectHeight: node.height,
        objectStroke: node.strokeWeight,
        objectRadius: node.cornerRadius,
    });
    // 4. Receive data from plugin UI
    figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
        if (msg.type == "resize-by-percentage") {
            node.resize(Math.round(msg.width * msg.percentageRatio), Math.round(msg.height * msg.percentageRatio));
            x.forEach((item) => {
                item.x = Math.round(item.x * msg.percentageRatio);
            });
            y.forEach((item) => {
                item.y = Math.round(item.y * msg.percentageRatio);
            });
            n.forEach((item) => {
                item.resize(Math.round(item.width * msg.percentageRatio), Math.round(item.height * msg.percentageRatio));
            });
            node.cornerRadius = Math.round(node.cornerRadius * msg.percentageRatio);
            radius.forEach((item) => {
                item.cornerRadius = Math.round(item.cornerRadius * msg.percentageRatio);
            });
            node.strokeWeight = Math.round(node.strokeWeight * msg.percentageRatio);
            stroke.forEach((item) => {
                item.strokeWeight = Math.round(item.strokeWeight * msg.percentageRatio);
            });
            figma.notify(`⚡️ Hurray! Your selection has been resized by percentage.`);
        }
        else if (msg.type == "resize-by-width") {
            node.resize(Math.round(node.width * msg.widthRatio), Math.round(node.height * msg.widthRatio));
            x.forEach((item) => {
                item.x = item.x * msg.widthRatio;
            });
            y.forEach((item) => {
                item.y = item.y * msg.widthRatio;
            });
            n.forEach((item) => {
                item.resize(Math.round(item.width * msg.widthRatio), Math.round(item.height * msg.widthRatio));
            });
            node.cornerRadius = Math.round(node.cornerRadius * msg.widthRatio);
            radius.forEach((item) => {
                item.cornerRadius = Math.round(item.cornerRadius * msg.widthRatio);
            });
            node.strokeWeight = Math.round(node.strokeWeight * msg.widthRatio);
            stroke.forEach((item) => {
                item.strokeWeight = Math.round(item.strokeWeight * msg.widthRatio);
            });
        }
        else if (msg.type == "resize-by-height") {
            node.resize(Math.round(node.width * msg.heightRatio), Math.round(node.height * msg.heightRatio));
            x.forEach((item) => {
                item.x = item.x * msg.heightRatio;
            });
            y.forEach((item) => {
                item.y = item.y * msg.heightRatio;
            });
            n.forEach((item) => {
                item.resize(Math.round(item.width * msg.heightRatio), Math.round(item.height * msg.heightRatio));
            });
            node.cornerRadius = Math.round(node.cornerRadius * msg.heightRatio);
            radius.forEach((item) => {
                item.cornerRadius = Math.round(item.cornerRadius * msg.heightRatio);
            });
            node.strokeWeight = Math.round(node.strokeWeight * msg.heightRatio);
            stroke.forEach((item) => {
                item.strokeWeight = Math.round(item.strokeWeight * msg.heightRatio);
            });
        }
        else {
            figma.closePlugin();
        }
    });
}
