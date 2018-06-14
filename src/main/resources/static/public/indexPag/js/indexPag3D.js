var GlobalViewer = null;
var pModelInfos = [];
var token = undefined;
var nowSelectedPModelInfo = null;
var nowSelectedComponentID = null;

$(function () {
    //$.parser.parse();
    GlobalViewer = initEarth("earth");
    initLiftClik()
    /*var jimeidashaUrl = "http://cfgateway.gbim360.cn/freeserver-pmts/services/share/51533a3e-30d9-42cb-88a0-2d734676d151/pmts/1.0.0/PMTSCapabilities.json?accesskey=ab70f9d4-d793-4a68-88bb-6146c0271610"
    var nowshuju = addPmdoel(jimeidashaUrl);*/
    //debugger
})

function initEarth(containerID) {
    var viewer = Freedo.FdApp.createDefaultViewer(containerID, {
        homeButton: true // 是否展示Home按钮
    }, {
        //hasProvinceBoundaries: true // 是否绘制中国省界
        planeMode: true
    });
    viewer.scene.backgroundColor = Freedo.Color.fromCssColorString('#deebf7');
    return viewer;
}

function addBtnClick() {
   //console.log($("#eutbURL").val());
    //var jimeidashaUrl = "http://cfgateway.gbim360.cn/freeserver-pmts/services/share/51533a3e-30d9-42cb-88a0-2d734676d151/pmts/1.0.0/PMTSCapabilities.json?accesskey=ab70f9d4-d793-4a68-88bb-6146c0271610"
    addPmdoel($("#eutbURL").val());
}

function addPmdoel(url) {
    var pmodelCache = {}
    Freedo.FdServer.FdPMTSParser.getPModelURLArray(url, function (pModelInfoArray) {
        var promise = new Promise(function (resolve, reject) {
            for (var i = 0; i < pModelInfoArray.length; i++) {
                var pModelInfo = pModelInfoArray[i];

                // 加载模型
                var pModel = GlobalViewer.scene.primitives.add(new Freedo.FreedoPModelset({
                    url: pModelInfo.pModelURL
                }));
                console.log(pModelInfo.pModelURL)
                pModelInfos.push({
                    pModel: pModel,
                    matrix: pModelInfo.matrix,
                    matrixSet: pModelInfo.matrixSet,
                    layer: pModelInfo.layer
                });

                if (i === pModelInfoArray.length - 1) {
                    resolve();
                }

                pModel.readyPromise.then(function (pModel) {
                    // that._viewer.camera.viewBoundingSphere(pModel.boundingSphere,
                    //     new Freedo.HeadingPitchRange(
                    //         0, -0.5, 0));
                    // that._viewer.camera.lookAtTransform(Freedo.Matrix4.IDENTITY);
                    Freedo.FdCamera.FdPlaneViewCameraHelper.flyToBoundingSphere(GlobalViewer.scene, pModel.boundingSphere);
                });
            }
        });

        promise.then(function (res) {
            for (var i in pModelInfos) {
                var pModelInfo = pModelInfos[i];
                var rootTree = {
                    layer: pModelInfo.layer,
                    matrixSet: pModelInfo.matrixSet,
                    matrix: pModelInfo.matrix,
                    title: pModelInfo.matrix.title,
                    uid: pModelInfo.matrix.uid,
                    child: [{}],
                }
                treeSet.addRootTree = rootTree;
            }
            console.log(pModelInfos)
            if(!$("#myTreeDiv >ul")[0]){
                // 初始化创建结构树
                var html = treeSet.createTree({
                    onNodeClick: nodeClick,
                    onNodeExpand: nodeExpand,

                });
                //console.log($("#myTreeDiv >ul")[0])
                // 拼接结果
                var tree = document.getElementById('myTreeDiv');
                tree.append(html);
            }else {
                var tree = document.getElementById('myTreeDiv');
                tree.innerHTML = "";
                tree.append(treeSet.renderTree(treeSet.treeArray));
            }
        })

    });
    return pmodelCache;
}

function initLiftClik() {
    var hanlder = new Freedo.ScreenSpaceEventHandler(GlobalViewer.scene.canvas);
    hanlder.setInputAction(function (movement) {
        GlobalViewer.camera.cancelFlight();
        var pos = movement.position;
        pickComponent(pos, true, function (pModel, componentID, ancestorComponents) {
            if (typeof pModel !== 'undefined' && typeof componentID !== 'undefined') {
                var pModelInfo = pModelInfos.find(function (element) {
                    return element.pModel === pModel;
                });
                //that.getComponentInfo(pModelInfo, componentID, ancestorComponents, 0);

                nowSelectedComponentID = componentID;
                nowSelectedPModelInfo = pModelInfo;
                $('#mydialog').window('open');
                $('#mydialog').dialog('refresh', 'plan/form?id='+componentID+'&modelId='+pModelInfo.layer.identifier+'___'+pModelInfo.matrix.identifier);
                console.log(pModelInfo)

                pModel.style = new Freedo.FreedoPModelStyle({
                    color: {
                        conditions: [
                            ['${component} ~== \'' + componentID + '\'',
                                'rgba(255, 0, 0, 1.0)'
                            ],
                            ['true', 'color("white")']
                        ]
                    },
                    show: 'true',
                });
                GlobalViewer.scene.requestRender();
            } else {
                pModelInfos.forEach(function (pModelInfo) {
                    var pModel = pModelInfo.pModel;
                    pModel.style = new Freedo.FreedoPModelStyle({});
                });
                GlobalViewer.scene.requestRender();
            }
        });

    }, Freedo.ScreenSpaceEventType.LEFT_CLICK);
}

function pickComponent(windowPosition, retAncestorComponents, selectedCallback) {
    var picked = GlobalViewer.scene.pick(windowPosition);
    //this.modelUI.componentInfo = {};
    // 阻挡测量模式的点选
    if (Freedo.defined(picked)) {
        var componentID = picked.getProperty('component');
        if (Freedo.defined(componentID)) {
            var ancestorComponents = undefined;
            if (retAncestorComponents) {
                ancestorComponents = picked.getAncestors('component');
            }
            selectedCallback(picked._content._tileset, componentID, ancestorComponents);
            return;
        }
    }

    selectedCallback();
}

function nodeClick(data, node) {
    console.log('node', data, node);
    var pModelInfo = pModelInfos.find(function (element) {
        return element.matrix === data.matrix;
    });
    if(pModelInfo){
        nowSelectedPModelInfo = pModelInfo;
        nowSelectedComponentID = data.uid;
        $('#mydialog').window('open');
        $('#mydialog').dialog('refresh', 'plan/form?id='+data.uid+'&modelId='+pModelInfo.layer.identifier+'___'+pModelInfo.matrix.identifier);
        pModelInfo.pModel.style = new Freedo.FreedoPModelStyle({
            color: {
                conditions: [
                    ['${component} ~== \'' + data.uid + '\'',
                        'rgba(255, 0, 0, 1.0)'
                    ],
                    ['true', 'color("white")']
                ]
            },
            show: 'true',
        });
    }
}

function nodeExpand(data, node) {
    if (data.child.length === 0 || data.child[0].title) {
        return false;
    } else {
        data.child = [];
    }
    Freedo.FdServer.FdPMTSParser.getCidJson(data.layer, data.matrixSet, data.matrix, data.roottileno, data.uid, token, function (json, error) {
        if (typeof error === 'undefined') {
            for (var i in json) {
                var item = json[i]
                var obj = {
                    layer: data.layer,
                    title: item.name || item.Name,
                    matrixSet: data.matrixSet,
                    matrix: data.matrix,
                    roottileno: data.matrixSet.roottileno,
                    uid: item.uid,
                    child: [{}],
                }
                data.child.push(obj);
            }
            // console.log(data);
            treeSet.addNode(data.child, node);
        } else {
            console.log('error: ' + error);
        }
    })
}