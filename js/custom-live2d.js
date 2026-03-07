(function () {
    var config = window.__customLive2DConfig;
    var shell = document.getElementById('custom-live2d-shell');
    var stage = document.getElementById('custom-live2d-stage');
    var statusText = document.getElementById('custom-live2d-text');

    if (!config || !shell || !stage) {
        return;
    }

    var WATERMARK_ID = 26;
    var FLOPPY_EARS_ID = 14;
    var CHIBI_ID = 18;
    var YOUNG_ID = 25;
    var BASE_FIXED_EXPRESSION_IDS = [WATERMARK_ID, FLOPPY_EARS_ID];
    var ACTION_PREFIX = 'action-';
    var EMOTION_PREFIX = 'emotion-';
    var BODY_TIMEZONE = config.timezone || 'Asia/Shanghai';

    var expressionCatalog = [
        { id: 0, key: 'action-asmr', label: 'ASMR' },
        { id: 1, key: 'action-controller', label: '手柄' },
        { id: 2, key: 'action-bouquet', label: '花束' },
        { id: 3, key: 'action-doll', label: '玩偶' },
        { id: 4, key: 'action-mic', label: '话筒' },
        { id: 5, key: 'action-heart', label: '比心' },
        { id: 6, key: 'emotion-star-eyes', label: '星星眼' },
        { id: 7, key: 'emotion-tears', label: '流泪' },
        { id: 8, key: 'emotion-love-eyes', label: '爱心眼' },
        { id: 9, key: 'emotion-angry', label: '生气' },
        { id: 10, key: 'emotion-dark-face', label: '黑脸' },
        { id: 11, key: 'emotion-spiral-eyes', label: '蚊香眼' },
        { id: 12, key: 'ears-rabbit-1', label: '兔耳 1' },
        { id: 13, key: 'ears-rabbit-2', label: '兔耳 2' },
        { id: 14, key: 'ears-floppy', label: '垂耳兔' },
        { id: 15, key: 'ears-cat', label: '猫耳' },
        { id: 16, key: 'ears-wing', label: '翼耳' },
        { id: 17, key: 'wings', label: '翅膀' },
        { id: 18, key: 'chibi', label: 'Q版' },
        { id: 19, key: 'doll-eyes', label: '玩偶眼' },
        { id: 20, key: 'flying-head-no-neck', label: '无脖飞头' },
        { id: 21, key: 'flying-head-with-neck', label: '有脖飞头' },
        { id: 22, key: 'halo-off', label: '关闭光环' },
        { id: 23, key: 'headwear-off', label: '关闭头饰' },
        { id: 24, key: 'trail', label: '拖尾' },
        { id: 25, key: 'young', label: '幼态' },
        { id: 26, key: 'watermark', label: '水印' }
    ];

    var actionExpressionIds = expressionCatalog
        .filter(function (item) {
            return item.key.indexOf(ACTION_PREFIX) === 0;
        })
        .map(function (item) {
            return item.id;
        });

    var emotionExpressionIds = expressionCatalog
        .filter(function (item) {
            return item.key.indexOf(EMOTION_PREFIX) === 0;
        })
        .map(function (item) {
            return item.id;
        });

    var expressionMap = {};
    var expressionDataMap = {};
    var activeExpressionIds = BASE_FIXED_EXPRESSION_IDS.slice();
    var currentActionId = null;
    var currentEmotionId = null;
    var currentBodyFormId = null;
    var currentBodyFormLabel = '正版本';
    var app = null;
    var model = null;
    var clickTimer = null;
    var bodyFormTimer = null;

    expressionCatalog.forEach(function (item) {
        expressionMap[item.id] = item;
    });

    function setStatus(text) {
        if (statusText) {
            statusText.textContent = text;
        }
    }

    function getExpressionItem(expressionId) {
        return expressionMap[expressionId] || null;
    }

    function getCurrentHourInTimezone() {
        var formatter = new Intl.DateTimeFormat('zh-CN', {
            timeZone: BODY_TIMEZONE,
            hour: '2-digit',
            hourCycle: 'h23'
        });
        var parts = formatter.formatToParts(new Date());
        var hourPart = parts.find(function (part) {
            return part.type === 'hour';
        });

        return hourPart ? parseInt(hourPart.value, 10) : new Date().getHours();
    }

    function getTimedBodyForm() {
        var hour = getCurrentHourInTimezone();

        if (hour >= 5 && hour < 11) {
            return {
                id: CHIBI_ID,
                label: 'Q版',
                period: '早上'
            };
        }

        if (hour >= 11 && hour < 17) {
            return {
                id: YOUNG_ID,
                label: '幼版',
                period: '中午'
            };
        }

        return {
            id: null,
            label: '正版本',
            period: '晚上'
        };
    }

    function syncActiveExpressions() {
        var nextIds = BASE_FIXED_EXPRESSION_IDS.slice();

        if (currentBodyFormId !== null) {
            nextIds.push(currentBodyFormId);
        }

        if (currentActionId !== null) {
            nextIds.push(currentActionId);
        }

        if (currentEmotionId !== null) {
            nextIds.push(currentEmotionId);
        }

        activeExpressionIds = nextIds.filter(function (expressionId, index, list) {
            return list.indexOf(expressionId) === index;
        });
    }

    function syncTimedBodyForm() {
        var bodyForm = getTimedBodyForm();
        currentBodyFormId = bodyForm.id;
        currentBodyFormLabel = bodyForm.label;
        syncActiveExpressions();
        return bodyForm;
    }

    function buildDefaultStatus() {
        var bodyForm = syncTimedBodyForm();
        return '当前是' + bodyForm.period + '，体型固定为' + bodyForm.label + '，垂耳兔和水印常驻。点击人物切换动作和表情。';
    }

    function buildSwitchStatus(actionId, emotionId) {
        syncTimedBodyForm();
        var actionItem = getExpressionItem(actionId);
        var emotionItem = getExpressionItem(emotionId);
        var actionLabel = actionItem ? actionItem.label : '待机';
        var emotionLabel = emotionItem ? emotionItem.label : '默认';

        return '当前体型' + currentBodyFormLabel + '。已切换：动作 ' + actionLabel + '，表情 ' + emotionLabel + '。';
    }

    function resetToDefaultState() {
        window.clearTimeout(clickTimer);
        currentActionId = null;
        currentEmotionId = null;
        syncActiveExpressions();
        setStatus(buildDefaultStatus());
    }

    function pickNextExpression(pool, currentId) {
        if (!pool.length) {
            return null;
        }

        var candidatePool = pool.filter(function (expressionId) {
            return expressionId !== currentId;
        });

        if (!candidatePool.length) {
            candidatePool = pool.slice();
        }

        return candidatePool[Math.floor(Math.random() * candidatePool.length)];
    }

    function switchInteractiveExpressions() {
        var nextActionId = pickNextExpression(actionExpressionIds, currentActionId);
        var nextEmotionId = pickNextExpression(emotionExpressionIds, currentEmotionId);

        if (nextActionId !== null) {
            currentActionId = nextActionId;
        }

        if (nextEmotionId !== null) {
            currentEmotionId = nextEmotionId;
        }

        syncActiveExpressions();
        setStatus(buildSwitchStatus(currentActionId, currentEmotionId));
    }

    function resizeStage() {
        if (!app || !model) {
            return;
        }

        var width = stage.clientWidth || 320;
        var height = stage.clientHeight || 420;

        app.renderer.resize(width, height);

        var bounds = model.getLocalBounds();
        var scale = Math.min(width * 1.18 / bounds.width, height * 1.18 / bounds.height);

        model.scale.set(scale);
        model.anchor.set(0.5, 1);
        model.position.set(width * 0.54, height * 1.06);
    }

    function applyBlendParameter(coreModel, parameter) {
        var weight = typeof parameter.Weight === 'number' ? parameter.Weight : 1;
        var blend = parameter.Blend || 'Overwrite';

        if (blend === 'Add') {
            coreModel.addParameterValueById(parameter.Id, parameter.Value, weight);
            return;
        }

        if (blend === 'Multiply') {
            coreModel.multiplyParameterValueById(parameter.Id, parameter.Value, weight);
            return;
        }

        coreModel.setParameterValueById(parameter.Id, parameter.Value, weight);
    }

    function applyActiveExpressions() {
        var internalModel = model && model.internalModel;
        var coreModel = internalModel && internalModel.coreModel;

        if (!coreModel) {
            return;
        }

        activeExpressionIds.forEach(function (expressionId) {
            var expression = expressionDataMap[expressionId];

            if (!expression || !Array.isArray(expression.Parameters)) {
                return;
            }

            expression.Parameters.forEach(function (parameter) {
                applyBlendParameter(coreModel, parameter);
            });
        });
    }

    function triggerStageAction() {
        switchInteractiveExpressions();
    }

    function bindStageInteractions() {
        stage.addEventListener('pointermove', function (event) {
            if (!model) {
                return;
            }

            var rect = stage.getBoundingClientRect();
            model.focus(event.clientX - rect.left, event.clientY - rect.top);
        });

        stage.addEventListener('pointerleave', function () {
            if (!model) {
                return;
            }

            model.focus(stage.clientWidth * 0.5, stage.clientHeight * 0.38, true);
        });

        stage.addEventListener('click', function () {
            if (!model) {
                return;
            }

            window.clearTimeout(clickTimer);
            clickTimer = window.setTimeout(function () {
                triggerStageAction();
            }, 180);
        });

        stage.addEventListener('dblclick', function () {
            resetToDefaultState();
        });
    }

    function loadExpressionDefinitions() {
        return fetch(config.modelPath)
            .then(function (response) {
                return response.json();
            })
            .then(function (modelJson) {
                var definitions = (modelJson.FileReferences && modelJson.FileReferences.Expressions) || [];
                var tasks = definitions.map(function (definition, index) {
                    var item = expressionCatalog[index];

                    if (!item || !definition || !definition.File) {
                        return Promise.resolve();
                    }

                    var expressionUrl = new URL(definition.File, window.location.origin + config.modelPath).toString();

                    return fetch(expressionUrl)
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (expressionJson) {
                            expressionDataMap[item.id] = expressionJson;
                        });
                });

                return Promise.all(tasks);
            });
    }

    function init() {
        resetToDefaultState();

        if (!window.PIXI || !window.PIXI.live2d || !window.PIXI.live2d.Live2DModel) {
            setStatus('Live2D 运行时加载失败。');
            return;
        }

        app = new window.PIXI.Application({
            width: stage.clientWidth || 320,
            height: stage.clientHeight || 420,
            transparent: true,
            antialias: true,
            autoStart: true,
            autoDensity: true,
            powerPreference: 'high-performance',
            resolution: Math.min(window.devicePixelRatio || 1, 3)
        });

        stage.appendChild(app.view);
        app.view.setAttribute('aria-label', 'Custom Live2D');

        Promise.all([
            window.PIXI.live2d.Live2DModel.from(config.modelPath),
            loadExpressionDefinitions()
        ]).then(function (results) {
            model = results[0];
            window.__customLive2DApp = app;
            window.__customLive2DModel = model;
            app.stage.addChild(model);
            resizeStage();
            bindStageInteractions();
            model.focus(stage.clientWidth * 0.5, stage.clientHeight * 0.38, true);
            model.motion(config.idleGroup, 0);
            model.internalModel.on('beforeModelUpdate', applyActiveExpressions);
            shell.setAttribute('data-ready', 'true');
            resetToDefaultState();
        }).catch(function (error) {
            console.error(error);
            setStatus('模型或动作定义加载失败。');
        });

        window.clearInterval(bodyFormTimer);
        bodyFormTimer = window.setInterval(function () {
            var previousBodyFormLabel = currentBodyFormLabel;
            syncTimedBodyForm();

            if (previousBodyFormLabel !== currentBodyFormLabel) {
                if (currentActionId === null && currentEmotionId === null) {
                    setStatus(buildDefaultStatus());
                } else {
                    setStatus(buildSwitchStatus(currentActionId, currentEmotionId));
                }
            }
        }, 60000);

        window.addEventListener('resize', resizeStage);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
