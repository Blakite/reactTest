/**
 * 제 품: IBSheet8 - Common Plugin
 * 버 전: v0.0.3-DEV.1 (20200831-1747)
 * 회 사: (주)아이비리더스
 * 주 소: https://www.ibsheet.com
 * 전 화: (02) 2621-2288~9
 */

/**
 * @Description :Code For Vplus 영역은 ibsheet에서 제공하는 파일을 대체해야 함.
 * 1.CommonOptions
 * 2.IBP
 * 3.ibSheet용 변수들
 * 4.beforeCreate
 * 5.IBS_CopySheet2Form
 */
(function(window, document) {
    /*CommonOptions 설정
     * 모든 시트에 동일하게 적용하고자 하는 설정을 CommonOptions에 등록합니다.
     * 해당 파일은 반드시 ibsheet.js 파일보다 뒤에 include 되어야 합니다.
     */
    var _IBSheet = window['IBSheet'];
    if (_IBSheet == null) {
        throw new Error('[ibsheet-common] undefined global object: IBSheet');
    }

    // IBSheet Plugins Object
    var Fn = _IBSheet['Plugins'];

    if (!Fn.PluginVers) Fn.PluginVers = {};
    Fn.PluginVers.ibcommon = {
      name: 'ibcommon',
      version: '0.0.3-20200831-1747-DEV-1'
    };

    // [Code For vPlus] 1. CommonOptions Start
    _IBSheet.CommonOptions = {
        Cfg : {
            Export : {
                Url : "/resources/jsp/",    // 엑셀다운 URL
            },
            SuppressExportMessage : 1, // file 로딩 관련 메세지 비활성화
            Size:"Low",             // 높이 27
            Style: gridStyle,
            Alternate: 2,           // 홀짝 행에 대한 배경색 설정
            AlternateType: 1,       // 트리시트에서 자식행도 Alternate 에 포함하여 하이라이트 처리

            // 그룹핑 컬럼명은 빨강색, 건수는 파란색으로 표시
            GroupFormat: " <span style='color:red'>{%s}</span> <span style='color:blue'>({%c}건)</span>",
            HeaderMerge: 3,         // 헤더영역 자동 병합
            HeaderCheckMode: 1,     // 헤더 체크 시 시트에 보이는 행에 대해서만 동작
            DataMerge: 0,           // 데이터영역 자동 병합
            SearchMode: 0,          // 조회 타입
            PrevColumnMerge: 1,     // 앞컬럼 기준 병합 사용 여부
            SearchCells: 1,         // 찾기 기능 셀단위/행단위 선택
            ShowHint: 0,            // 마우스 hover시 hint 표시기능
            InfoRowConfig: {
                Visible: 0,
            },                      // 칼럼수 정보
            MaxPages: 6,            // SearchMode:2인 경우 한번에 갖고 있는 페이지 수(클수록 브라우져의 부담이 커짐)
            MaxSort: 3,             // 최대 소팅 가능 컬럼수(4개 이상인 경우 느려질 수 있음)
            SortIconsNum : 1,       // 소팅 순서 정보
            UseHeaderSortCancel: 1, // 소팅 초기화
            HeaderSortMode : 0,     // Sort order for click
            DisableKeyWord: 0,      // 필터 예약어 미사용 처리
            CanEdit: 3,             // 수정가능 Default값
            InEditMode: 1,          // Edit Mode
            DataAutoTrim: 1,        // 조회 또는 저장 시 데이터의 공백 트림 여부 설정(default: false)
            FitWidth: 1,            // 헤더를 최대로 넓히는 옵션
            CustomScroll:  0,       // 사용자 정의 스크롤 형태 (0:default)
            StorageSession: 1,      // 개인화 기능(컬럼정보 저장) 사용 여부
            AutoSelectYm: 1,
            FormulaRowNoFiltered: true,

            // 저장 키 prefix 설정
            StorageKeyPrefix: window.sampleName ? window.sampleName : location.href,
            PasteFocused : 9,       // 시트에서 ctrl+c 로 복사한 데이터를 ctrl+v 로 붙여넣을때 데이터가 붙여질 방식을 설정합니다. (포커스된 행 하단으로 붙여넣기 하다가 더 이상 덮어씌울 행이 없는 경우에는 행을 추가하여 붙여넣기 함.)
            UnicodeByteMode:3,      // 한글에 대한 기본 크기 설정
            MsgLocale: "Ko",        // 메시지 언어 설정
        },
        Def : {
            Header : { // 헤더 영역 행에 대한 설정
                Menu : {
                    Items : [
                        { Name: "컬럼 감추기" },
                        { Name: "컬럼 감추기 취소" },
                        { Name: "*-" },
                        { Name: "컬럼 정보 저장" },
                        { Name: "컬럼 정보 저장 취소" },
                        { Name: "*-" },
                        { Name: "필터행 생성" },
                        { Name: "필터 감추기" },
                        { Name: "*-" },
                        { Name: "정렬 초기화" }
                    ],
                    "OnSave" : function(item,_) {
                        switch (item.Name) {
                        case '컬럼 감추기':
                            var col = item.Owner.Col;
                            this.Sheet.hideCol(col, 1);
                            break;
                        case '컬럼 감추기 취소':
                            this.Sheet.showCol();
                            break;
                        case '컬럼 정보 저장':
                            this.Sheet.saveCurrentInfo();
                            break;
                        case '컬럼 정보 저장 취소':
                            this.Sheet.clearCurrentInfo();
                            this.Sheet.showMessageTime({
                              message: "컬럼 정보를 삭제하였습니다.<br>새로고침하시면 초기 설정의 시트를 확인하실 수 있습니다."
                            });
                            break;
                        case '필터행 생성':
                            this.Sheet.showFilterRow();
                            break;
                        case '필터 감추기':
                            this.Sheet.hideFilterRow();
                            break;
                        case '정렬 초기화':
                            this.Sheet.clearSort();
                            break;
                        }
                    },
                }
            },

            Row : {
                Height:24,
                // 데이터 영역 모든 행에 대한 설정
                AlternateColor:"#fafafa", //짝수행에 대한 배경색
                Menu:{ //마우스 우측버특 클릭시 보여지는 메뉴 설정 (메뉴얼에서 Appedix/Menu 참고)
                    Items:[
                         { Name: "다운로드", Caption:1 },
                         { Name: "Excel 다운로드", Value:"xls" },
                        //  { Name: "Excel 다운로드(필터)", Value: "xls_visible"},
                    ],
                    OnSave:_fnContextMenuAction,
                },
                CanFormula:1, 
                CalcOrder:"Color", 
                "ColorFormula": (function(){
                    var commonColorFormula = function (param){
                        if(param.Row.DUM_CHK != undefined && param.Row.DUM_CHK == 1){
                            return "#FFF3CD";
                        }else if(param.Row.DUM_CHK != undefined && param.Row.DUM_CHK != 1){
                            return "#FFFFFF";
                        }
                        return null;
                    };
                    commonColorFormula._isCommonOptions = true;
                    return commonColorFormula;
                })()
            },

            FormulaRow : {
                Color: "#e0f2ff",
            }
        },
        Events : {
            "onKeyDown" : function(evtParam) {
                // Ctrl+Shift+F 입력시 찾기 창 오픈
                if (evtParam.prefix == "ShiftCtrl" && evtParam.key == 70) {
                    evtParam.sheet.showFindDialog();
                } else if (evtParam.prefix == "CtrlAlt" && evtParam.key == 84) {
                    evtParam.sheet.createPivotDialog();
                }
            },
            // FloatSize 유효성 검사 ('-'만 입력 후 저장 시 오류 발생)
            "onResultMask" : function(evtParam) {
                let rowSeq = evtParam.row.SEQ;
                let colNm = evtParam.sheet.Cols[evtParam.col]['Header'];
                alert(`${colNm}열의 ${rowSeq}번째 행의 입력값이 유효하지 않습니다.\n다시 입력해 주세요.`);
                return 2;
            },
        }
    };

    // _fnContextMenuAction를 오버라이딩 한 함수
    function _fnContextMenuActionWithParam(extend) { return _fnContextMenuAction(extend); }

    // 실제 메뉴 선택 시 발생 이벤트 정의 함수
    function _fnContextMenuAction(extend) {
        return async function(item,data) {//메뉴 선택시 발생 이벤트
            vLog("info",data);
            const downOption = {
                 fileName       : `${thisPageNm}_${this.Sheet.id.replace('ib', '')}.xlsx`
                ,sheetDesign    : 1
                ,downCols       : 'Visible'
                ,merge          : 1
                ,excelFontSize  : 11
                ,excelRowHeight : 16.5
                ,downTreeHide   : true
            };
            switch(item.Value) {
                case 'xls':
                    const confirmMsg = `<div>
                        현재 시트에 필터가 적용되어 있습니다.<br>
                        필터된 행만 다운로드하시겠습니까?
                        <div class="mt-2"><span class="text-primary">(확인: 필터된 데이터 다운로드)</span>
                        <br>(전체: 전체 데이터 다운로드)
                    </div>`;

                    if (this.Sheet.hasFilter() && await _message.confirm(confirmMsg, null, true, [{ name: '확인', value: true }, { name: '전체', value: false }])) {
                        downOption.downRows = 'Visible';
                    }

                    try {
                        if (vChk.useObjsVal(extend,"excelCanEdit")) { gfnIbBeforeExcelDown(this.Sheet); }
                        this.Sheet.down2Excel(downOption);
                    } catch(e) {
                        vLog(e);
                        if (e.message.indexOf("down2Excel is not a function") > -1) {
                            console.error('경고 : ibsheet-excel.js 파일이필요합니다.');
                        }
                    }
                    break;
                case 'xls_visible':
                    try{
                        if (vChk.useObjsVal(extend,"excelCanEdit")) {
                            gfnIbBeforeExcelDown(this.Sheet);
                        }
                        this.Sheet.down2Excel({
                                 fileName       : `${thisPageNm}_${this.Sheet.id.replace('ib', '')}.xlsx`
                                ,sheetDesign    : 1
                                ,downCols       : 'Visible'
                                ,downRows       : 'Visible'
                                ,merge          : 1
                                ,excelFontSize  : 11
                                ,excelRowHeight : 16.5
                                ,downTreeHide   : true
                            });
                    }catch(e){
                        vLog(e);
                        if(e.message.indexOf("down2Excel is not a function")>-1){
                            console.log("%c 경고","color:#FF0000"," : ibsheet-excel.js 파일이필요합니다.");
                        }
                    }
                    break;
                case 'txt':
                    try{
                        this.Sheet.down2Text({
                             fileName : `${thisPageNm}_${this.Sheet.id.replace('ib', '')}.txt`
                            ,downCols : "Visible"
                            ,merge    : 1
                        });
                    }catch(e){
                        vLog(e);
                        if(e.message.indexOf("down2Text is not a function")>-1){
                            console.log("%c 경고","color:#FF0000"," : ibsheet-excel.js 파일이필요합니다.");
                        }
                    }
                    break;
                case 'addAbove':
                    try {
                        this.Sheet.addRow({next:this.Row});
                    } catch(e) {
                        vLog(e);
                    }
                    break;
                case 'addBelow':
                    try{
                        this.Sheet.addRow({next:this.Sheet.getNextRow(this.Row)});
                    }catch(e){
                        vLog(e);
                    }
                    break;
                case 'del':
                    try{
                        this.Sheet.removeRow(this.Row);
                    }catch(e){
                        vLog(e);
                    }
                    break;
            }
        }
    }

    // [Code For vPlus] 1.CommonOptions End

    // [Code For vPlus] 2.IBP Start
    /*-----------------------------------------------------
    -- ● ibStatus, ibDelCheck는 vPlus ibSheet8용 변수
    -----------------------------------------------------*/
    window.IBP = {
        // 날짜 시간 포멧
        "YMD" : {
            Type : "Date",
            Align : "Center",
            Width : 110,
            Format : 'yyyy-MM-dd',
            EditFormat : 'yyyy-MM-dd',
            DataFormat : 'yyyyMMdd',
            Size : 8,
            //EmptyValue : "<span style='color:#AAA'>년,월,일 순으로 숫자만 입력해 주세요.</span>"
        },
        "YM" : {
            Type : "Date",
            Align : "Center",
            Width : 80,
            Format : 'yyyy-MM',
            EditFormat : 'yyyy-MM',
            DataFormat : 'yyyyMM',
            Size : 6,
            //EmptyValue : "<span style='color:#AAA'>년,월 순으로 숫자만 입력해 주세요.</span>"
        },
        "Y" : {
            Type : "Date",
            Align : "Center",
            Width : 80,
            Format : 'yyyy',
            EditFormat : 'yyyy',
            DataFormat : 'yyyy',
            Size : 4,
            //EmptyValue : "<span style='color:#AAA'>년,월 순으로 숫자만 입력해 주세요.</span>"
        },
        /*"MD" : {
            Type : "Date",
            Align : "Center",
            Width : 60,
            Format : 'MM-dd',
            EditFormat : 'MMdd',
            DataFormat : 'MMdd',
            Size : 4,
            EmptyValue : "<span style='color:#AAA'>월,일 순으로 숫자만 입력해 주세요.</span>"
        },*/
        "HMS" : {
            Type : "Date",
            Align : "Center",
            Width : 70,
            Format : 'HH:mm:ss',
            EditFormat : 'HH:mm:ss',
            DataFormat : 'HHmmss',
            Size : 8,
            //EmptyValue : "<span style='color:#AAA'>시,분,초 순으로 8개 숫자만 입력해 주세요.</span>"
        },
        "HM" : {
            Type : "Date",
            Align : "Center",
            Width : 70,
            Format : 'HH:mm',
            EditFormat : 'HH:mm',
            DataFormat : 'HHmm',
            Size : 5,
            //EmptyValue : "<span style='color:#AAA'>시,분 순으로 4개 숫자만 입력해 주세요.</span>"
        },
        "YMDHMS" : {
            Type : "Date",
            Align : "Center",
            Format : 'yyyy-MM-dd HH:mm:ss',
            Width : 150,
            EditFormat : 'yyyy-MM-dd HH:mm:ss',
            DataFormat : 'yyyyMMddHHmmss',
            Size : 19,
            //EmptyValue : "<span style='color:#AAA'>숫자만 입력(ex:20190514153020)</span>"
        },
        "YMDHM" : {
            Type : "Date",
            Align : "Center",
            Format : 'yyyy-MM-dd HH:mm',
            Width : 150,
            EditFormat : 'yyyy-MM-dd HH:mm',
            DataFormat : 'yyyyMMddHHmmss.s',
            Size : 16,
            //EmptyValue : "<span style='color:#AAA'>숫자만 입력(ex:201905141530)</span>"
        },
        /*"MDY" : {
            Type : "Date",
            Align : "Center",
            Format : 'MM-dd-yyyy',
            Width : 110,
            EditFormat : 'MMddyyyy',
            DataFormat : 'yyyyMMdd',
            Size : 8,
            EmptyValue : "<span style='color:#AAA'>월,일,년 순으로 숫자만 입력해 주세요.</span>"
        },
        "DMY" : {
            Type : "Date",
            Align : "Center",
            Format : 'dd-MM-yyyy',
            Width : 110,
            EditFormat : 'ddMMyyyy',
            DataFormat : 'yyyyMMdd',
            Size : 8,
            EmptyValue : "<span style='color:#AAA'>일,월,년 순으로 숫자만 입력해 주세요.</span>"
        },*/

        // 숫자 포멧
        "Integer" : {
            Type : "Int",
            Align : "Right",
            Format : "#,##0",
            Width : 100
        },
        "NullInteger" : {
            Type : "Int",
            Align : "Right",
            Format : "#,###",
            Width : 100,
            CanEmpty : 1
        },
        // null 허용 0, 양수
        "NullPosInteger" : {
            Type : "Int",
            Align : "Right",
            Format : "#,###",
            Width : 100,
            CanEmpty : 1,
            EditMask : "^\\d*$",
        },
        "Float" : {
            Type : "Float",
            Align : "Right",
            Format : "#,##0.######",
            Width : 100
        },
        "NullFloat" : {
            Type : "Float",
            Align : "Right",
            Format : "#,###.######",
            Width : 100
        },

        // 기타포멧
        "IdNo" : {
            Type : "Text",
            Align : "Center",
            CustomFormat : "IdNo"
        },
        "SaupNo" : {},
        "PostNo" : {},
        "CardNo" : function(v) {return gfnIbCustomFormat("cardNo",v)},
        "PhoneNo" : {},
        "Number" : {},
        "CorpNo" :function(v) {return gfnIbCustomFormat("corpNo",v)},
    };
    // [Code For vPlus] 2.IBP End

    // [Code For vPlus] 3.ibSheet용 변수들 Start
    // Status Type
    window.ibStatus = {
        Type : "Text",
        CanFilter : 0,
        Align : "Center",
        RelWidth:0,
        Width : 40,
        Formula : "Row.Deleted ? 'D' : Row.Added ? 'I' : Row.Changed ? 'U' : 'R'",
        Size:0,
        Required:0,
        CanSort:0,
        ColMerge:0,
        Format : {
            'I' : '입력',
            'U' : '수정',
            'D' : '삭제',
            'R' : ''
        }
    };

    // SEQ Type
    window.ibSeq = {
        Align:"center",
        CanFilter:0,
        RelWidth:0,
        MinWidth:40,
        CanEdit:0,
        Size:0,
        Required:0,
        CanSort:0,
        NoColor:2,
        Color: "#F1F1F1",
    };

    // DelCheck Type
    window.ibDelCheck = {
        Type : "Bool",
        Align : "Center",
        RelWidth:0,
        Width : 40,
        Size:0,
        Required:0,
        CanSort:0,
        CanEdit:1,
        OnClick : function(evtParam) {
            // 부모가 체크되어 있는 경우 더 이상 진행하지 않는다.
            var chked = !(evtParam.row[evtParam.col]);
            var prows = evtParam.sheet.getParentRows(evtParam.row);
            if (!chked && prows[0] && prows[0][evtParam.col]) return true;
        },
        OnChange : function(evtParam) {
            var chked = evtParam.row[evtParam.col];
            // 신규행에 대해서는 즉시 삭제한다.
            if (evtParam.row.Added) {
                setTimeout(function() {
                    evtParam.sheet.removeRow(evtParam.row);
                    // 신규행 바로 삭제 이벤트 (vplus용으로 만든 이벤트)
                    !vChk.isEmpty(evtParam.sheet.options.Events.onAddedRowDelete) && evtParam.sheet.options.Events.onAddedRowDelete(evtParam);
                }, 30);
            } else {
                // 행을 삭제 상태로 변경
                evtParam.sheet.deleteRow(evtParam.row,
                        evtParam.row[evtParam.col]);
                // 자식행 추출
                var rows = evtParam.sheet.getChildRows(evtParam.row);
                rows.push(evtParam.row);

                // 모두 체크하고 편집 불가로 변경
                rows.forEach(function(row) {
                    evtParam.sheet.setValue(row, evtParam.col, chked, 0);
                    row.CanEdit = !evtParam.row[evtParam.col];
                    if (!row[evtParam.col + "CanEdit"]) {
                        row[evtParam.col + "CanEdit"] = true;
                    }
                    evtParam.sheet.refreshRow(row);
                });
            }
        },
    };

    window.ibInfoTop = {
        Visible: 1,
        Layout: ['Count'],
        Space: 'Top',
    };

    window.ibInfoBottom = {
        Visible: 1,
        Layout: ['Count'],
        Space: 'Bottom',
    };

    window.ibInfoToElement = {
        Visible: 0,
        Layout: ['Count'],
        Format: '[ TOTALROWS건 ]'
    };

    // ibSheet에서 제공해준 FromToChange 이벤트 함수 재정의
    function _fnFromToChange(evt) {
        var chgValue = evt.row[evt.col]                   // 값
          , oppoNm = evt.sheet.Cols[evt.col]["DATE_REF"] || evt.sheet.Cols[evt.col]["DATE_REForigin"]  // 상대 칼럼명
          , dateTp = evt.sheet.Cols[evt.col]["DATE_TYPE"] // 현재 칼럼의 DATE 타입
          , frmCol = dateTp == "from" ? evt.col : oppoNm  // 시작 칼럼
          , toCol  = dateTp == "from" ? oppoNm : evt.col  // 끝 칼럼
          , frmTtl = vChk.nvl(evt.sheet.getHeaderRows()[evt.sheet.getHeaderRows().length-1][frmCol], "시작날짜")  // 시작타이틀명
          , toTtl  = vChk.nvl(evt.sheet.getHeaderRows()[evt.sheet.getHeaderRows().length-1][toCol], "끝날짜");   // 끝타이틀명

        var baseDt = evt.sheet.Cols[evt.col]["DATE_BASE"]; // 시작칼럼의 기준값

        // 상대 컬럼 값과 현재 변경 컬럼 값이 모두 있을 때
        if (!vChk.isEmpty(evt.row[oppoNm]) && !vChk.isEmpty(evt.row[evt.col])) {
            if (dateTp === 'from') { // from 일때
                if (vChk.nvl(evt.row[oppoNm], '') < chgValue) {
                    vAlert(`${toTtl}(To)가 ${frmTtl}(From)보다 이전입니다. \r\n${frmTtl}(From)가 자동 수정됩니다.`);
                    evt.row[evt.col] = vChk.nvl(evt.row[oppoNm], "");
                }
            } else if (dateTp === 'to') { // to 일때
                if (vChk.nvl(evt.row[oppoNm], '') > chgValue) {
                    vAlert(`${frmTtl}(From)가 ${toTtl}(To)보다 이후입니다. \r\n${toTtl}(To)가 자동 수정됩니다.`);
                    evt.row[evt.col] = vChk.nvl(evt.row[oppoNm], "");
                }
            } else {

            }
        }

        // ibSheet에서 제공해준 이벤트 함수 호출
        fromto_onChange(evt);
    }

    // Popup,PopupEdit
    window.ibPopup = {"Type": "Text","Width": 100,"Align": "Center","Button":"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0IiB2aWV3Qm94PSIwIDAgNjQwIDY0MCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1Ij48ZGVmcz48cGF0aCBkPSJNMjc5LjczIDM0LjdMMjg5LjAxIDM1LjY0TDI5OC4xNyAzNi45NUwzMDcuMjIgMzguNjFMMzE2LjEzIDQwLjYyTDMyNC45MiA0Mi45OEwzMzMuNTYgNDUuNjZMMzQyLjA1IDQ4LjY4TDM1MC4zOCA1Mi4wMUwzNTguNTUgNTUuNjZMMzY2LjU1IDU5LjYxTDM3NC4zNyA2My44NkwzODIuMDEgNjguMzlMMzg5LjQ1IDczLjIxTDM5Ni42OCA3OC4zMUw0MDMuNzEgODMuNjdMNDEwLjUzIDg5LjNMNDE3LjEyIDk1LjE3TDQyMy40OCAxMDEuMjlMNDI5LjYgMTA3LjY1TDQzNS40OCAxMTQuMjRMNDQxLjEgMTIxLjA2TDQ0Ni40NiAxMjguMDlMNDUxLjU2IDEzNS4zM0w0NTYuMzggMTQyLjc3TDQ2MC45MiAxNTAuNEw0NjUuMTcgMTU4LjIyTDQ2OS4xMiAxNjYuMjJMNDcyLjc2IDE3NC4zOUw0NzYuMSAxODIuNzJMNDc5LjExIDE5MS4yMkw0ODEuOCAxOTkuODZMNDg0LjE1IDIwOC42NEw0ODYuMTYgMjE3LjU2TDQ4Ny44MiAyMjYuNkw0ODkuMTMgMjM1Ljc2TDQ5MC4wNyAyNDUuMDRMNDkwLjY0IDI1NC40Mkw0OTAuODMgMjYzLjlMNDkwLjY0IDI3My4zOEw0OTAuMDcgMjgyLjc2TDQ4OS4xMyAyOTIuMDRMNDg3LjgyIDMwMS4yTDQ4Ni4xNiAzMTAuMjVMNDg0LjE1IDMxOS4xNkw0ODEuOCAzMjcuOTVMNDc5LjExIDMzNi41OUw0NzYuMSAzNDUuMDhMNDcyLjc2IDM1My40MUw0NjkuMTIgMzYxLjU4TDQ2NS4xNyAzNjkuNThMNDYwLjkyIDM3Ny40TDQ1Ni4zOCAzODUuMDRMNDUxLjczIDM5Mi4yMkw1OTYuOTcgNTM3LjQ2TDUzNC40MyA2MDBMMzg5LjE5IDQ1NC43NkwzODIuMDEgNDU5LjQxTDM3NC4zNyA0NjMuOTVMMzY2LjU1IDQ2OC4yTDM1OC41NSA0NzIuMTVMMzUwLjM4IDQ3NS43OUwzNDIuMDUgNDc5LjEzTDMzMy41NiA0ODIuMTRMMzI0LjkyIDQ4NC44M0wzMTYuMTMgNDg3LjE4TDMwNy4yMiA0ODkuMTlMMjk4LjE3IDQ5MC44NUwyODkuMDEgNDkyLjE2TDI3OS43MyA0OTMuMUwyNzAuMzUgNDkzLjY3TDI2MC44NyA0OTMuODZMMjUxLjM5IDQ5My42N0wyNDIuMDEgNDkzLjFMMjMyLjczIDQ5Mi4xNkwyMjMuNTcgNDkwLjg1TDIxNC41MyA0ODkuMTlMMjA1LjYxIDQ4Ny4xOEwxOTYuODMgNDg0LjgzTDE4OC4xOSA0ODIuMTRMMTc5LjY5IDQ3OS4xM0wxNzEuMzYgNDc1Ljc5TDE2My4xOSA0NzIuMTVMMTU1LjE5IDQ2OC4yTDE0Ny4zNyA0NjMuOTVMMTM5Ljc0IDQ1OS40MUwxMzIuMyA0NTQuNTlMMTI1LjA2IDQ0OS40OUwxMTguMDMgNDQ0LjEzTDExMS4yMSA0MzguNTFMMTA0LjYyIDQzMi42M0w5OC4yNiA0MjYuNTFMOTIuMTQgNDIwLjE1TDg2LjI3IDQxMy41Nkw4MC42NCA0MDYuNzRMNzUuMjggMzk5LjcxTDcwLjE4IDM5Mi40OEw2NS4zNiAzODUuMDRMNjAuODIgMzc3LjRMNTYuNTggMzY5LjU4TDUyLjYzIDM2MS41OEw0OC45OCAzNTMuNDFMNDUuNjUgMzQ1LjA4TDQyLjYzIDMzNi41OUwzOS45NSAzMjcuOTVMMzcuNTkgMzE5LjE2TDM1LjU4IDMxMC4yNUwzMy45MiAzMDEuMkwzMi42MSAyOTIuMDRMMzEuNjcgMjgyLjc2TDMxLjEgMjczLjM4TDMwLjkxIDI2My45TDMxLjEgMjU0LjQyTDMxLjY3IDI0NS4wNEwzMi42MSAyMzUuNzZMMzMuOTIgMjI2LjZMMzUuNTggMjE3LjU2TDM3LjU5IDIwOC42NEwzOS45NSAxOTkuODZMNDIuNjMgMTkxLjIyTDQ1LjY1IDE4Mi43Mkw0OC45OCAxNzQuMzlMNTIuNjMgMTY2LjIyTDU2LjU4IDE1OC4yMkw2MC44MiAxNTAuNEw2NS4zNiAxNDIuNzdMNzAuMTggMTM1LjMzTDc1LjI4IDEyOC4wOUw4MC42NCAxMjEuMDZMODYuMjcgMTE0LjI0TDkyLjE0IDEwNy42NUw5OC4yNiAxMDEuMjlMMTA0LjYyIDk1LjE3TDExMS4yMSA4OS4zTDExOC4wMyA4My42N0wxMjUuMDYgNzguMzFMMTMyLjMgNzMuMjFMMTM5Ljc0IDY4LjM5TDE0Ny4zNyA2My44NkwxNTUuMTkgNTkuNjFMMTYzLjE5IDU1LjY2TDE3MS4zNiA1Mi4wMUwxNzkuNjkgNDguNjhMMTg4LjE5IDQ1LjY2TDE5Ni44MyA0Mi45OEwyMDUuNjEgNDAuNjJMMjE0LjUzIDM4LjYxTDIyMy41NyAzNi45NUwyMzIuNzMgMzUuNjRMMjQyLjAxIDM0LjdMMjUxLjM5IDM0LjEzTDI2MC44NyAzMy45NEwyNzAuMzUgMzQuMTNMMjc5LjczIDM0LjdaTTI0OS4yMyAxMjIuNDhMMjQzLjUxIDEyMy4wNkwyMzcuODYgMTIzLjg3TDIzMi4yOCAxMjQuODlMMjI2Ljc3IDEyNi4xM0wyMjEuMzUgMTI3LjU5TDIxNi4wMiAxMjkuMjRMMjEwLjc4IDEzMS4xTDIwNS42NCAxMzMuMTZMMjAwLjYgMTM1LjQxTDE5NS42NiAxMzcuODVMMTkwLjg0IDE0MC40N0wxODYuMTMgMTQzLjI3TDE4MS41NCAxNDYuMjRMMTc3LjA3IDE0OS4zOUwxNzIuNzMgMTUyLjdMMTY4LjUzIDE1Ni4xN0wxNjQuNDYgMTU5Ljc5TDE2MC41NCAxNjMuNTdMMTU2Ljc2IDE2Ny40OUwxNTMuMTQgMTcxLjU2TDE0OS42NyAxNzUuNzZMMTQ2LjM2IDE4MC4xTDE0My4yMSAxODQuNTdMMTQwLjI0IDE4OS4xNkwxMzcuNDQgMTkzLjg3TDEzNC44MiAxOTguNjlMMTMyLjM4IDIwMy42M0wxMzAuMTMgMjA4LjY3TDEyOC4wNyAyMTMuODFMMTI2LjIxIDIxOS4wNUwxMjQuNTYgMjI0LjM4TDEyMy4xIDIyOS44TDEyMS44NiAyMzUuMzFMMTIwLjg0IDI0MC44OUwxMjAuMDMgMjQ2LjU0TDExOS40NSAyNTIuMjZMMTE5LjEgMjU4LjA1TDExOC45OCAyNjMuOUwxMTkuMSAyNjkuNzVMMTE5LjQ1IDI3NS41NEwxMjAuMDMgMjgxLjI2TDEyMC44NCAyODYuOTJMMTIxLjg2IDI5Mi41TDEyMy4xIDI5OEwxMjQuNTYgMzAzLjQyTDEyNi4yMSAzMDguNzVMMTI4LjA3IDMxMy45OUwxMzAuMTMgMzE5LjEzTDEzMi4zOCAzMjQuMTdMMTM0LjgyIDMyOS4xMUwxMzcuNDQgMzMzLjkzTDE0MC4yNCAzMzguNjRMMTQzLjIxIDM0My4yM0wxNDYuMzYgMzQ3LjdMMTQ5LjY3IDM1Mi4wNEwxNTMuMTQgMzU2LjI0TDE1Ni43NiAzNjAuMzFMMTYwLjU0IDM2NC4yM0wxNjQuNDYgMzY4LjAxTDE2OC41MyAzNzEuNjRMMTcyLjczIDM3NS4xMUwxNzcuMDcgMzc4LjQyTDE4MS41NCAzODEuNTZMMTg2LjEzIDM4NC41M0wxOTAuODQgMzg3LjMzTDE5NS42NiAzODkuOTZMMjAwLjYgMzkyLjM5TDIwNS42NCAzOTQuNjRMMjEwLjc4IDM5Ni43TDIxNi4wMiAzOTguNTZMMjIxLjM1IDQwMC4yMkwyMjYuNzcgNDAxLjY3TDIzMi4yOCA0MDIuOTFMMjM3Ljg2IDQwMy45NEwyNDMuNTEgNDA0Ljc0TDI0OS4yMyA0MDUuMzJMMjU1LjAyIDQwNS42N0wyNjAuODcgNDA1Ljc5TDI2Ni43MiA0MDUuNjdMMjcyLjUxIDQwNS4zMkwyNzguMjMgNDA0Ljc0TDI4My44OSA0MDMuOTRMMjg5LjQ3IDQwMi45MUwyOTQuOTcgNDAxLjY3TDMwMC4zOSA0MDAuMjJMMzA1LjcyIDM5OC41NkwzMTAuOTYgMzk2LjdMMzE2LjEgMzk0LjY0TDMyMS4xNCAzOTIuMzlMMzI2LjA4IDM4OS45NkwzMzAuOSAzODcuMzNMMzM1LjYxIDM4NC41M0wzNDAuMiAzODEuNTZMMzQ0LjY3IDM3OC40MkwzNDkuMDEgMzc1LjExTDM1My4yMSAzNzEuNjRMMzU3LjI4IDM2OC4wMUwzNjEuMiAzNjQuMjNMMzY0Ljk4IDM2MC4zMUwzNjguNjEgMzU2LjI0TDM3Mi4wOCAzNTIuMDRMMzc1LjM5IDM0Ny43TDM3OC41MyAzNDMuMjNMMzgxLjUgMzM4LjY0TDM4NC4zIDMzMy45M0wzODYuOTMgMzI5LjExTDM4OS4zNiAzMjQuMTdMMzkxLjYxIDMxOS4xM0wzOTMuNjcgMzEzLjk5TDM5NS41MyAzMDguNzVMMzk3LjE5IDMwMy40MkwzOTguNjQgMjk4TDM5OS44OCAyOTIuNUw0MDAuOTEgMjg2LjkyTDQwMS43MSAyODEuMjZMNDAyLjI5IDI3NS41NEw0MDIuNjQgMjY5Ljc1TDQwMi43NiAyNjMuOUw0MDIuNjQgMjU4LjA1TDQwMi4yOSAyNTIuMjZMNDAxLjcxIDI0Ni41NEw0MDAuOTEgMjQwLjg5TDM5OS44OCAyMzUuMzFMMzk4LjY0IDIyOS44TDM5Ny4xOSAyMjQuMzhMMzk1LjUzIDIxOS4wNUwzOTMuNjcgMjEzLjgxTDM5MS42MSAyMDguNjdMMzg5LjM2IDIwMy42M0wzODYuOTMgMTk4LjY5TDM4NC4zIDE5My44N0wzODEuNSAxODkuMTZMMzc4LjUzIDE4NC41N0wzNzUuMzkgMTgwLjFMMzcyLjA4IDE3NS43NkwzNjguNjEgMTcxLjU2TDM2NC45OCAxNjcuNDlMMzYxLjIgMTYzLjU3TDM1Ny4yOCAxNTkuNzlMMzUzLjIxIDE1Ni4xN0wzNDkuMDEgMTUyLjdMMzQ0LjY3IDE0OS4zOUwzNDAuMiAxNDYuMjRMMzM1LjYxIDE0My4yN0wzMzAuOSAxNDAuNDdMMzI2LjA4IDEzNy44NUwzMjEuMTQgMTM1LjQxTDMxNi4xIDEzMy4xNkwzMTAuOTYgMTMxLjFMMzA1LjcyIDEyOS4yNEwzMDAuMzkgMTI3LjU5TDI5NC45NyAxMjYuMTNMMjg5LjQ3IDEyNC44OUwyODMuODkgMTIzLjg3TDI3OC4yMyAxMjMuMDZMMjcyLjUxIDEyMi40OEwyNjYuNzIgMTIyLjEzTDI2MC44NyAxMjIuMDFMMjU1LjAyIDEyMi4xM0wyNDkuMjMgMTIyLjQ4WiIgaWQ9ImJpVVlobFRwNiI+PC9wYXRoPjwvZGVmcz48Zz48Zz48Zz48dXNlIHhsaW5rOmhyZWY9IiNiaVVZaGxUcDYiIG9wYWNpdHk9IjEiIGZpbGw9IiM1OTU5NTkiIGZpbGwtb3BhY2l0eT0iMSI+PC91c2U+PC9nPjwvZz48L2c+PC9zdmc+"};

    // From Date
    window.ibFrom = {Header:"FROM", DATE_TYPE:"from", Align:"Center",Type:"Date",Width:110,Format:'yyyy-MM-dd',EditFormat:'yyyy-MM-dd',DataFormat:'yyyyMMdd',Size:10,OnChange:_fnFromToChange};

    // To Date
    window.ibTo   = {Header:"To",   DATE_TYPE:"to",   Align:"Center",Type:"Date",Width:110,Format:'yyyy-MM-dd',EditFormat:'yyyy-MM-dd',DataFormat:'yyyyMMdd',Size:10,OnChange:_fnFromToChange};

    // DummyCheck
    // window.ibDumChk = {Name:"DUM_CHK",Type:"Bool",NoChanged:true,CanSort:0,DumClick:1,CanEdit:0,NoColor:1,Width:40};
    window.ibDumChk = {Name:"DUM_CHK",Type:"Bool",NoChanged:true,CanSort:0,DumClick:1,CanEdit:1,Width:40, HeaderCheck:1};

    // 체크박스 IMAGE
    window.ibChkImg = "/resources/login/images/bg_check.png"

    // 버튼 IMAGE
    window.ibBtnImg = "/resources/img/magnifier.png";

    // colorPicker IMAGE
    window.ibClrImg = "/resources/img/palette.svg";

    // 파일 IMAGE
    window.ibFileImg = "/resources/img/file.png";

    // 폴더 IMAGE
    window.ibFolderImg = "/resources/img/opened_folder.png";

    // 다운로드 IMAGE
    window.ibDLImg = "/resources/img/download-solid.svg";

    // IB_Preset
    window.ibYYYY = "^\\d{0,4}$";   //연도

    // ibSheet용 공통 색 변수
    window.linkFontColor = "#0054FF";      //링크표시
    window.highLightFontColor = "#0000FF"; //강조색상
    window.highLightBackColor = "#00FFFF"; //강조배경색상
    window.sumBackColor = "#EAF1FB";       //총계배경색
    window.sumFontColor = "#333333";          //총계글자색
    window.subSumBackColor1 = "#FFEADA";   //소계배경색1
    window.subSumBackColor2 = "#ffd6b7";   //소계배경색2
    window.subSumBackColor3 = "#cbdbff";   //소계배경색3
    window.subSumFontColor = "#333333";       //소계글자색
    window.dumCheckHighlight = "#fff3cd";  //더미체크하이라트색
    window.canEditFalseColor = "#F4F4F4";  //CanEdit False 색(Excel 다운로드용)
    window.headerBackColor = "#F1F1F1";    //Header 배경색

    // ibSheet Image Enum용 변수
    window.ibImgEnumKeys = {};
    window.ibImgEnum = {};

    // 경영관리 신호등 이미지
    var strTrafficLight = function(color) {
        return "|<div style='text-align:center'><image src='/resources/img/module/em/"+color+".png'></image></div>";
    }
    window.ibImgEnumKeys.em001 = "|G|Y|R"; // green/yellow/red
    window.ibImgEnum.em001 = strTrafficLight("green") + strTrafficLight("yellow") + strTrafficLight("red");


    // [Code For vPlus] 3.ibSheet용 변수들 End
    /*
    - IBSheet 내 From-To 달력

    from 입력시 to 셀이 비어있거나
    to 입력시 from 셀이 비어있는 경우
    해당 셀 위에 달력을 표시해 줌.
    */
    var fromto_onChange = function(evt) {
        var chgValue = evt.row[evt.col];
        var oppoNm = evt.sheet.Cols[evt.col]["DATE_REF"] || evt.sheet.Cols[evt.col]["DATE_REForigin"] ;
        var oppoValueTimeStamp = evt.row[oppoNm];

        if (!evt.sheet.Cols[oppoNm] || evt.row[oppoNm]) return;
        var opt = {
            Date: evt.row[oppoNm],
            Format: evt.sheet.getAttribute(null,oppoNm, "Format"),
            OnCanEditDate: function(d) {
                if (chgValue != "") {
                    if (evt.sheet.Cols[evt.col]["DATE_TYPE"] != "from") {
                        if (d > chgValue) return false;
                    } else {
                        if (d < chgValue) return false;
                    }
                }
            },
            OnGetCalendarDate: function(d, dt, _, __) {
                if (oppoValueTimeStamp == "" || chgValue == "") return;

                if (isFrom) {
                    if (d >= chgValue && d <= oppoValueTimeStamp) return "<span style='color:orange'>" + dt + "</span>";
                } else {
                    if (d <= chgValue && d >= oppoValueTimeStamp) return "<span style='color:orange'>" + dt + "</span>";
                }
            },
        };

        var calObj = evt.sheet.showCalendar(evt.row, oppoNm, opt, null, function(v) {
            evt.sheet.setValue(evt.row,oppoNm,v);

            // setValue(method)를 통한 수정에는 onBeforeChange가 호출되지 않기 때문에 추가 22.12.05
            // cell 입력값 유효성 검사는 onEndEdit을 사용해야 하기 때문에 추후 수정
            if (evt.sheet.options.Events.hasOwnProperty("onBeforeChange")) {
                gfnIbCallEvents(evt.sheet, evt, "onBeforeChange");
            }

            evt.col = oppoNm;
            evt.val = v;

            // 화면에 onAfterChange 이벤트 작성했을 때만 호출
            if (typeof evt.sheet.options.Events.onAfterChange === 'function') {
                evt.sheet.options.Events.onAfterChange(evt);
            }

            calObj.Close();
        });
    }

    // [Code For vPlus] 4.beforeCreate Start
    // ibsheet 초기화 공통 설정 (obj를 통해 시트 생성시 create()에 넣은 parameter가 전달됨)
    _IBSheet.beforeCreate = function(obj) {
        // vplus용 변수 객체 초기화
        obj.options.vplus = vChk.nvl(obj.options.vplus, {});

        // 공통적으로 수정가능인지 확인.
        let _canEdit = parseInt(obj.options.Cfg.CanEdit) === 1 ? true : false;

        // Context Menu의 엑셀 다운로드 재정의
        if (!vChk.nvl(obj.options.Cfg.CustomCtxtMenu, false)) { // 화면에서 아이비시트 컨텍스트 메뉴 재정의하기 위한 옵션
            if (obj.options.Cfg.hasOwnProperty("ExcelCanEditColor") && vChk.nvl(obj.options.Cfg.ExcelCanEditColor,false)) {
                obj.options.Def.Row.Menu.OnSave = _fnContextMenuActionWithParam({excelCanEdit:true});
            } else {
                obj.options.Def.Row.Menu.OnSave = _fnContextMenuActionWithParam({excelCanEdit:false});
            }
        }

        // DUM_CHK 컬럼이 있는지 확인
        var hasDumChkColumn = false;
        var allColumns = [].concat(
            obj.options.LeftCols || [],
            obj.options.Cols || [],
            obj.options.RightCols || []
        );
        for (var i = 0; i < allColumns.length; i++) {
            if (allColumns[i] && allColumns[i].Name === 'DUM_CHK') {
                hasDumChkColumn = true;
                break;
            }
        }
        
        // DUM_CHK 컬럼이 없으면 CommonOptions의 ColorFormula 제거 (개별 정의는 유지)
        if (!hasDumChkColumn && obj.options.Def.Row && obj.options.Def.Row.ColorFormula) {
            // CommonOptions에서 온 것만 제거 (플래그로 구분)
            if (obj.options.Def.Row.ColorFormula._isCommonOptions === true) {
                delete obj.options.Def.Row.ColorFormula;
                // CalcOrder에서 Color 제거
                if (obj.options.Def.Row.CalcOrder === "Color") {
                    delete obj.options.Def.Row.CalcOrder;
                } else if (obj.options.Def.Row.CalcOrder && obj.options.Def.Row.CalcOrder.indexOf("Color") > -1) {
                    var calcOrder = obj.options.Def.Row.CalcOrder;
                    calcOrder = calcOrder.replace(/^Color,|,Color,|,Color$/g, ',').replace(/^Color$|^,|,$/g, '');
                    if (calcOrder) {
                        obj.options.Def.Row.CalcOrder = calcOrder;
                    } else {
                        delete obj.options.Def.Row.CalcOrder;
                    }
                }
            }
        }

        /** ----------------------------------------------------------------
        ------------Cols행 초기설정을 위한 private 함수---------------------
        -------------------------------시작---------------------------------
        -----------------------------------------------------------------**/
        // [private] column의 Extend값을 실제 속성으로 bind하는 함수
        function _fnAssginExtend(array) {
            return array.map(element => {
                if (element.Extend) {
                    return $.extend({}, element.Extend, element);
                } else {
                    return element;
                }
            });
        }

        // [private] 2차원 이상 배열 처리 함수
        function _fnExecFunctionWithMultiDimension(_arr, funcs) {
            // 배열이 2차원 이상의 배열 일때
            if (gfnGetMultiDimensionSize(_arr)[1] !== 0) {
                // 리턴 값이 있는 경우
                return funcs.reduce(function(_rtnValue, func) {
                    return _arr.map(function(_element) {
                        return func(_element);
                    });
                },_arr);
            }
            // 배열이 1차원 일때
            else {
                return funcs.reduce(function(_rtnValue, func) {
                    return func(_rtnValue);
                }, _arr);
            }
        }

        // [private] 칼럼 속성들 공통값들로 적용하는 함수
        function _fnSettingColsProperties(_columns) {

            return _columns.map(function(_column){
                // calorder 변수화
                var v_CalcOrder = obj.options.Def.Row.CalcOrder;

                var settingEditMaskToObjKey = function(_editMaskFunc, _key) {
                    return function(input) {
                        return gfnIbEditMaskFunc(input,_editMaskFunc[_key]);
                    }
                }

                var settingEditMaskToObjKeyResolve = function() {
                    return function(input) {
                        return gfnIbEditMaskFunc(input);
                    }
                }

                // EditMaskFunc 재정의
                var editMaskFunc = vChk.useObjsVal(obj.options.Cfg, "VpEditMaskFunc");
                if (editMaskFunc) {
                    var rtnEditMaskFunc ={};
                    for(var key in editMaskFunc) {
                        rtnEditMaskFunc[key] = settingEditMaskToObjKey(editMaskFunc, key);
                        rtnEditMaskFunc[key+"Resolve"] = settingEditMaskToObjKeyResolve();
                    }
                    obj.options.Cfg.EditMaskFunc = rtnEditMaskFunc;
                }

                // type이 button인 경우 CanFilter:0으로 변경
                if (_column.Type === 'Button') { _column.CanFilter = 0; }

                // CanEdit가 false인 경우 Button 속성을 비워준다.
                if (!_column.hasOwnProperty('CanEditFormula') && _column.Type == 'Text') {
                    if (_canEdit) {
                        const colCanEdit = _column.CanEdit == null ? 0 : parseInt(_column.CanEdit);
                        if (colCanEdit !== 1 && _column.hasOwnProperty('Button')) {
                             _column.Button = '';
                        }
                    } else {
                        _column.Button = '';
                    }
                }

                // Multi Record같은 경우 Name이 필수가 아님. 그래서 Name 속성을 체크
                if (_column.Name) {

                    // header Size만큼 dummy check header 정보 넣기
                    if (_column.Name == "DUM_CHK") {
                        var _header = [];
                        var _HeaderCheck = _column.DumHeaderCheck || 0;

                        // headerName이 있는 지 확인 후 HeadeCheck 넣는 내부 공통 함수
                        function _dumHeaderCheckFn(_headerName) {
                            if (vChk.isEmpty(_headerName)) {
                                return {Value:"", HeaderCheck:1, IconAlign:"Center", Cursor:"pointer"};
                            }
                            else {
                                return {Value:_headerName, HeaderCheck:_HeaderCheck, IconAlign:"Center", Cursor:"pointer"};
                            }
                        }

                        if (typeof _column.Header === "string") {
                            _header.push(_dumHeaderCheckFn(_column.Header));
                        } else {
                            _column.Header.forEach(function(colheader) {
                                _header.push(_dumHeaderCheckFn(colheader));
                            })
                        }
                        _column.Width = _column.Width || 40;
                        _column.Header = _header;
                    }

                    // type이 Lines인 경우 Enter의 설정 변경
                    if (_column.Type == "Lines") {
                        _column.AcceptEnters = "1"; // 줄넘김문자가 삽입되고 편집모드 유지.Ctrl or Shift or Alt + Enter를 입력하거나 tab키를 입력 시 편집 종료
                    }

                    // type이 Enum인 경우 Icon의 위치를 오른쪽에 설정
                    if (_column.Type == "Enum") {
                        _column.IconAlign = "Right"; // Enum icon 위치조정
                    }

                    // type이 Date인 경우 Format:"yyyy-MM-dd", EditFormat:"yyyy-MM-dd", DataFormat:"yyyyMMdd"으로 변경
                    if (_column.Type == "Date") {

                        var useExtend = _column.hasOwnProperty('Extend');
                        var cstFormat = '';

                        // Extend를 사용했는데 포맷이 재적용되는 경우를 방지
                        if (!useExtend) {
                            _column.Format = vChk.isEmpty(_column.Format) ?  "yyyy-MM-dd" : _column.Format;
                            _column.EditFormat = vChk.isEmpty(_column.EditFormat) ? "yyyy-MM-dd" : _column.EditFormat;
                            _column.DataFormat = vChk.isEmpty(_column.DataFormat) ?  "yyyyMMdd" : _column.DataFormat;
                            _column.Size  = (vChk.isEmpty(_column.Size) || _column.Size == 0) ? _column.DataFormat.length : _column.Size;
                        }

                        var _colsSize = _column.Size;

                        // Extend 컬럼에 포맷에 맞는 EditMask 생성
                        if (useExtend) {
                            _column.Extend.EditFormat.split('').forEach(char => {
                                (/[a-zA-Z]/.test(char)) ? cstFormat += '9' : cstFormat += char;
                            });
                        }


                        !obj.options.Cfg.EditMaskFunc && (obj.options.Cfg.EditMaskFunc = {});

                        obj.options.Cfg.EditMaskFunc[_column.Name] = function(input) {
                            // 외부 jquery.inputmask 라이브러리를 "sDate_yyyyMM"에 연동
                            if (useExtend) {
                                $(input).inputmask(cstFormat)
                            } else {
                                switch(_colsSize) {
                                    case 4:
                                        $(input).inputmask('9999');
                                        break;
                                    case 6:
                                    case 7:
                                        $(input).inputmask('9999-99');
                                        break;
                                    default:
                                        $(input).inputmask('9999-99-99');
                                        break;
                                }
                            }
                        }
                        obj.options.Cfg.EditMaskFunc[_column.Name+"Resolve"] = function(input) {
                            // 외부 jquery.inputmask 라이브러리를 "sDate_yyyyMM"에 연동
                            // "sDate_yyyyMM"에 연동된 라이브러리에서 마스킹이 제거된 값을 리턴합니다.
                            return $(input)[0].inputmask.unmaskedvalue();
                        }

                        // Range Date인 경우
                        if (_column.hasOwnProperty("DATE_REF")) {
                            // 달력이 표시될때 일부 일자는 선택 불가능하게 만드는 이벤트
                            obj.options["Events"].onReadCanEditDate = function(evt) {
                                if(evt.sheet.Cols[evt.col]["DATE_REF"]){
                                    let oppoNm = evt.sheet.Cols[evt.col]["DATE_REF"]; // 컬럼명
                                    //From이전 일자나 To 이후 일자에 대해 선택하지 못하게 막음.
                                    if (evt.row[oppoNm]) {
                                        var isFrom = !!(evt.sheet.Cols[evt.col]["DATE_TYPE"]=="from");
                                        if(isFrom){
                                            if(evt.date> evt.row[oppoNm]) return false;
                                        }else{
                                            if(evt.date< evt.row[oppoNm]) return false;
                                        }
                                    }
                                }

                                // earlier 중 가장 이른 날짜 이후는 선택 불가
                                if (Array.isArray(evt.sheet.Cols[evt.col]?.DATE_REFearlier) && evt.sheet.Cols[evt.col].DATE_REFearlier.length > 0) {
                                    let getTimes = evt.sheet.Cols[evt.col].DATE_REFearlier.map(i => evt.row[i]);
                                    let earlierLimit = Math.max(...getTimes);

                                    if (earlierLimit > 0 && evt.date > earlierLimit) return false;
                                }

                                // later 중 가장 늦은 날짜 이전은 선택 불가
                                if (Array.isArray(evt.sheet.Cols[evt.col]?.DATE_REFlater) && evt.sheet.Cols[evt.col].DATE_REFlater.length > 0) {
                                    let getTimes = evt.sheet.Cols[evt.col].DATE_REFlater.map(i => evt.row[i]);
                                    let laterLimit = Math.min(...getTimes);

                                    if (laterLimit > 0 && evt.date < laterLimit) return false;
                                }

                            }

                            //달력이 표시될때 일부 일자에 내용을 변경해 주는 이벤트
                            obj.options["Events"].onReadDate = function(evt) {
                                if(evt.sheet.Cols[evt.col]["DATE_REF"]){
                                    var oppoNm = evt.sheet.Cols[evt.col]["DATE_REF"];
                                    if( !evt.row[ oppoNm ] || !evt.row[evt.col] )return;
                                    //From~To가 설정된 기간에 대해 글자색을 orange색으로 표시
                                    var isFrom = !!(evt.sheet.Cols[evt.col]["DATE_TYPE"]=="from");
                                    if(isFrom){
                                        if(evt.date>=evt.row[evt.col] && evt.row[ oppoNm ]) return "<span style='color:orange'>"+evt.text+"</span>";
                                    }else{
                                        if(evt.date<=evt.row[evt.col] && evt.row[ oppoNm ]) return "<span style='color:orange'>"+evt.text+"</span>";
                                    }
                                }
                            }
                        }
                    }

                    /** 1. WRK_TP **/
                    if (_column.Name == "WRK_TP") {

                        // CanFormula를 1로 셋팅
                        obj.options.Def.Row.CanFormula = 1;

                        // CalcOrder가 없는 경우
                        if (vChk.isEmpty(v_CalcOrder)) {
                            obj.options.Def.Row.CalcOrder = "WRK_TP";
                        }
                        // CalcOrder가 있는 경우
                        else if (!vChk.isEmpty(v_CalcOrder)) {
                            obj.options.Def.Row.CalcOrder = v_CalcOrder + ",WRK_TP";
                        }
                    }

                    /** 2. InsertEdit **/
                    if (_column.hasOwnProperty("EditOption") && _column.EditOption == "I") {
                        // CalcLogic에 해당 내용 추가
                        obj.options.Def.Row.CalcOrder = v_CalcOrder + "," + _column.Name + "CanEdit";

                        // CanEditFormula가 없는 경우
                        if (vChk.isEmpty(_column.CanEditFormula)) {
                            _column.CanEditFormula = _fnInsertRelatedfunction;
                        }
                        // CanEditFormula가 있는 경우
                        else if (!vChk.isEmpty(_column.CanEditFormula)) {
                            _column.CanEditFormula = _column.CanEditFormula + _fnInsertRelatedfunction;
                        }
                    }

                    /** 3. UpdateEdit **/
                    if (_column.hasOwnProperty("EditOption") && _column.EditOption == "U") {
                        // CalcLogic에 해당 내용 추가
                        obj.options.Def.Row.CalcOrder = v_CalcOrder + "," + _column.Name + "CanEdit";

                        // CanEditFormula가 없는 경우
                        if (vChk.isEmpty(_column.CanEditFormula)) {
                            _column.CanEditFormula = _fnUpdateRelatedfunction;
                        }
                        // CanEditFormula가 있는 경우
                        else if (!vChk.isEmpty(_column.CanEditFormula)) {
                            _column.CanEditFormula = _column.CanEditFormula + _fnUpdateRelatedfunction;
                        }
                    }
                }

                /** 4. FloatSize **/
                if (_column.hasOwnProperty("FloatSize")) {
                    // 0번 index는 총길이, 1번 index는 소수점 이하 자리수
                    var arrSize = _column.FloatSize.trim().split(",").map(function(arr) {
                        return Number(vChk.isEmpty(arr.trim()) ? 0 : arr.trim());
                    });
                    arrSize[1] = vChk.nvl(arrSize[1],0);
                    if (arrSize[0] < arrSize[1]) {
                        alert("FloatSize 속성을 잘못 입력하셨습니다. 다시 확인 바랍니다.");
                        return;
                    }
                    var diff = arrSize[0] - arrSize[1];
                    _column.EditMask = "^\-?\\d{0,".concat(diff, "}(\\.\\d{0,").concat(arrSize[1], "})?$");
                    // _column.EditMask = "^\\d{0,".concat(diff, "}(\\.\\d{0,").concat(arrSize[1], "})?$"); 기존 '-' 안붙는 정규식 23.01.12
                    _column.Size = Number(arrSize[0])+2;
                    _column.ResultMask = "^\-?[0-9]+(\\.[0-9]\+)?$\|^$";

                }

                var colType = "";
                /** 5. MinValue **/
                if (_column.hasOwnProperty("MinValue")) {
                    colType = _column.Type;
                    if (['Int','Float','Date'].indexOf(colType) >= 0) {
                        _column.OnChange = gfnIbCheckColumnsMinValue(_column.OnChange);
                    }
                }

                /** 6. MaxValue **/
                if (_column.hasOwnProperty("MaxValue")) {
                    colType = _column.Type;
                    if (['Int','Float','Date'].indexOf(colType) >= 0) {
                        _column.OnChange = gfnIbCheckColumnsMaxValue(_column.OnChange);
                    }
                }

                /** 7. Lang**/
                if (_column.hasOwnProperty("Lang")) {
                    _column.Lang.toLowerCase() == "ko" && (_column.EditMask = "^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$");
                    _column.Lang.toLowerCase() == "en" && (_column.EditMask = "^[a-zA-Z]*$");
                }

                /** 8. DumClick(CanEdit:0,2,3[수정불가] 일때도 체크가 되게하는 옵션) **/
                if (_column.hasOwnProperty('DumClick') && _column.DumClick) {
                    _column.OnClick = function(evt) {
                        var originData = evt.row[evt.col];
                        // Header 체크시 로직 처리
                        if (evt.row.Kind === 'Header' && (evt.sheet.Cols[evt.col].DumHeaderCheck == true || evt.row[evt.col] === '')) {
                            const value = evt.row[evt.col];
                            if (evt.row.CheckDataChecked || evt.sheet.Header[evt.col + 'Checked']) {
                                evt.sheet.getDataRows().forEach(function(ROW) {
                                    let flag =  evt.sheet.getAttribute(ROW, evt.col, 'DumCheckCond') === null ? null : Boolean(evt.sheet.getAttribute(ROW, evt.col, 'DumCheckCond'));
                                    // 일반 데이터 처리
                                    if (ROW.Name !== 'SubSum' && ROW.Visible && flag !== false) {
                                        evt.sheet.setValue(ROW, evt.col, false, 0);
                                        delete ROW['CheckData']; // 헤더 체크 후 체크/언체크 동기화를 위해 필요
                                        // evt.sheet.setAttribute(ROW, null, "Color", "", 0);
                                    }
                                });
                                // 헤더행 처리
                                // evt.sheet.setValue(evt.row, evt.col, false, 0);
                                //evt.row[evt.col] = "";
                                // evt.sheet.refreshCell(evt.row, evt.col);
                                // evt.sheet.rerender();
                            } else {
                                evt.sheet.getDataRows().forEach(function(ROW) {
                                    let flag =  evt.sheet.getAttribute(ROW, evt.col, 'DumCheckCond') === null ? null : Boolean(evt.sheet.getAttribute(ROW, evt.col, 'DumCheckCond'));
                                    // 일반 데이터 처리
                                    if (ROW.Name !== 'SubSum' && ROW.Visible && flag !== false) {
                                        evt.sheet.setValue(ROW, evt.col, true, 0);
                                        ROW['CheckData'] = true;
                                        // evt.sheet.setAttribute(ROW, null, 'Color', dumCheckHighlight, 0);
                                    }
                                });
                                // 헤더행 처리
                                // evt.sheet.setValue(evt.row, evt.col, true, 0);
                                //evt.row[evt.col] = "";
                                // evt.sheet.refreshCell(evt.row, evt.col);
                                // evt.sheet.rerender();
                            }
                            // 헤더행 처리
                            // evt.row[evt.col] = originData;
                            // evt.sheet.rerender();
                        }
                        // 1. Header를 클릭시 Header가 '선택'이나 다른 문구를 가지고 있을 때 2. 소계행일 때 값이 변경 되지 않기 위해서
                        else if ((evt.row.Kind == 'Header' && evt.row[evt.col] !== '') || (evt.row.Kind !== 'Filter' && evt.row.Name === 'SubSum')) {
                            evt.row[evt.col] = originData;
                            evt.sheet.refreshCell(evt.row, evt.col);
                        }
                        // Row.Kind == 'Data' 일 때(일반 행 DUM_CHK 클릭 시) 로직 처리
                        else if (evt.row.Kind !== 'Filter' && evt.row.Name != 'SubSum') {
                            if(evt.sheet.CanEdit != 1){
                                let flag = evt.sheet.getAttribute(evt.row, evt.col, 'DUM_CHK');
                                if (flag == 1){
                                    delete evt.row['CheckData'];
                                    delete evt.row[evt.col];
                                    // evt.sheet.setAttribute(evt.row, null, 'Color', '#FFFFFF', 1);
                                }else{
                                    evt.row['CheckData'] = true;
                                    evt.row[evt.col] = true;
                                    // evt.sheet.setAttribute(evt.row, null, 'Color', '#FFF3CD', 1);
                                }
                                evt.sheet.setAttribute(evt.row, null, 'Color', evt.row[evt.col] ? dumCheckHighlight : '#FFFFFF', 1);
                            }
                            // if (flag !== false) {
                            //     // HeaderCheck가 있으면 ibsheet의 기본 체크 동작을 사용하고, ColorFormula 재계산만 수행
                            //     if (_column.HeaderCheck) {
                            //         // ibsheet의 기본 체크 동작이 이미 실행되었으므로, ColorFormula 재계산을 위해 rerender 호출
                            //         // DUM_CHK 값 변경 후 ColorFormula가 재계산되도록 함
                            //         setTimeout(function() {
                            //             evt.sheet.rerender();
                            //         }, 10);
                            //     } else {
                            //         // HeaderCheck가 없으면 기존 로직 사용
                            //         if (evt.row['CheckData'] === undefined) {
                            //             evt.row['CheckData'] = true;
                            //             evt.row[evt.col] = true;
                            //         } else {
                            //             delete evt.row['CheckData'];
                            //             delete evt.row[evt.col];
                            //         }
                            //         evt.sheet.setAttribute(evt.row, null, 'Color', evt.row[evt.col] ? dumCheckHighlight : '#FFFFFF', 1);
                            //     }
                            //     alert("1: "+flag );
                            //     evt.sheet.rerender();
                            // }
                            // alert("2: "+flag);
                        }
                    }
                }

                /** 9. Bool Type일때 true, false value 셋팅 **/
                if (_column.Type == "Bool") {
                    _column.TrueValue = _column.TrueValue || "1";
                    _column.FalseValue = _column.FalseValue || "0";
                }

                /** 10. LinkCol**/
                if (_column.hasOwnProperty("LinkCol") && _column.LinkCol) {
                    _column.TextColor = linkFontColor;
                    _column.Cursor = "pointer";
                }

                /** 11. Related => Enum Chaining을 위한 로직 1**/
                if (_column.hasOwnProperty('Related')) {
                    let cols = [].concat(vChk.nvl(obj.options.LeftCols, []), vChk.nvl(obj.options.Cols, []), vChk.nvl(obj.options.RightCols, []));
                    let selCol = cols.filter(colParam => colParam.Name == _column.Related)[0];
                    let rtnEnum = '',
                        rtnEnumKeys = '',
                        chainData = new Set();

                    (selCol.ChainEnumKeys != null) && selCol.ChainEnumKeys.split('|').forEach((_key, index) => {
                        if (index === 0) { return; }
                        selCol.ChainData.forEach((_data, _index) => {
                            if (_key == _data.pid) {
                                rtnEnum += '|' + _data.nm;
                                rtnEnumKeys += '|' + _data.id;

                                if (_column[`Enum${_key}`] && _column[`Enum${_key}`] != '|') {
                                    _column[`Enum${_key}`] = _column[`Enum${_key}`] + '|' + _data.nm;
                                    _column[`EnumKeys${_key}`] = _column[`EnumKeys${_key}`] + '|' + _data.id;
                                } else {
                                    _column[`Enum${_key}`] = '|' + _data.nm;
                                    _column[`EnumKeys${_key}`] = '|' + _data.id;
                                }
                            } else {
                                if (vChk.nvl(_key, '').length === vChk.nvl(_data.pid, '').length && vChk.isEmpty(_column[`Enum${_key}`])) {
                                    _column[`Enum${_key}`] = '|';
                                    _column[`EnumKeys${_key}`] = '|';
                                }
                                chainData.add(_data);
                            }
                        });
                    });
                    _column.Enum = rtnEnum;
                    _column.EnumKeys = rtnEnumKeys;
                    _column.ChainData = chainData;
                }

                /** 12. ChainData => Enum Chaining을 위한 로직 2**/
                if (_column.hasOwnProperty("ChainData")) {

                    _column.ChainEnum = _column.Enum;
                    _column.ChainEnumKeys = _column.EnumKeys;
                    // 2레벨 이상일 때
                    if (_column.hasOwnProperty("Related")) {
                        delete _column.Enum;
                        delete _column.EnumKeys;
                    }
                }

                /** 13. FillUpCol => 빈공간으로 채우기 위한 속성**/
                if (_column.Name == " " || _column.hasOwnProperty("FillUpCol") || _column.FillUpCol) {
                    _column.Name = "_BLANK";
                    if (Array.isArray(_column["Header"])) {
                        _column["Header"] = _column["Header"].map(function(_headRow) {
                            _setFillUpColHeader(_headRow);
                        });
                    } else {
                        _column["Header"] = _setFillUpColHeader(_column["Header"]);
                    }
                    var defaultValue = {
                          Type     : "Text"
                        , Align    : "center"
                        , MinWidth : 200
                        , RelWidth : 10
                        , Visible  : 1
                        , CanEdit  : 3
                    }
                    _column = Object.assign(defaultValue,_column);

                    function _setFillUpColHeader(_obj) {
                        _obj = vChk.nvl(_obj,{});
                        _obj["TextColor"] = headerBackColor;
                        return _obj;
                    }
                }
                return _column;
            });
        }

        // [private] insertEdit 상황에 맞춰서 Button의 특성을 넣고 제거하는 함수.
        function _fnInsertRelatedfunction(param) {
            if (param.Row['Added'] == 1){
                _fnCodeFinderButtonControl(param, true);
                return 1;
            } else {
                _fnCodeFinderButtonControl(param, false);
                return 0;
            }
        }

        // [private] updateEdit 상황에 맞춰서 Button의 특성을 넣고 제거하는 함수.
        function _fnUpdateRelatedfunction(param) {
            if (param.Row['Changed'] == 1){
                _fnCodeFinderButtonControl(param, true);
                return 1;
            } else {
                _fnCodeFinderButtonControl(param, false);
                return 0;
            }
        }

        // [private] CodeFinder button Control 공통함수
        function _fnCodeFinderButtonControl(_param, _switch) {
            _param.Sheet.getCols("Button").map(function(col){
                if (col == _param.Col) {
                    _param.Sheet.getType(_param.Row, col) !== "Enum" && _param.Sheet.setAttribute(_param.Row, _param.Col, "Button", (_switch ? ibBtnImg : ""), 1);
                }
            });
            return _param;
        }

        /** ----------------------------------------------------------------
        ------------Cols행 초기설정을 위한 private 함수---------------------
        ------------------------------- 끝 ---------------------------------
        -----------------------------------------------------------------**/
        /** ----------------------------------------------------------------
        -------------------------Cols행 초기설정----------------------------
        -------------------------------시작---------------------------------
        -----------------------------------------------------------------**/
        var initCols = ["LeftCols", "Cols", "RightCols"];
        var opt = obj.options;
        // Extend 속성을 일반 속성에도 바인딩.
        initCols.forEach(function(arrName){
            // 칼럼 배열이 있는 지 확인
            if (vChk.isEmpty(obj.options[arrName])) {
                return;
            }

            // Extend값을 실제 속성으로 바인딩 후 칼럼 속성들 공통 적용
            obj.options[arrName] = _fnExecFunctionWithMultiDimension(obj.options[arrName], [_fnAssginExtend, _fnSettingColsProperties]);
        });

        // options의 LeftCols,Cols,RightCols에서 EnumEdit 타입이 있으면 변경해 준다.
        // Suggest 기능을 이용하여 찾기기능이 되는 드롭다운형식으로 변경해 준다.
        initCols.forEach((item,idx)=>{
            if(opt[item]){
                const tempCol = opt[item];
                tempCol.forEach((colObj,colIdx)=>{
                    if(colObj["Type"] && colObj["Type"] === "EnumEdit"){  // EnumEdit가 타입인 경우
                        if(colObj["Enum"] && colObj["EnumKeys"]){

                            var text = colObj["Enum"].substring(1).split(colObj["Enum"].substring(0,1) );
                            var keys = colObj["EnumKeys"].substring(1).split(colObj["EnumKeys"].substring(0,1) );
                            var newFormat = {};
                            for(var x=0;x<keys.length;x++){
                                newFormat[keys[x]] = text[x];
                            }
                            colObj["Type"] = "Text";
                            colObj["SuggestType"] = "Empty,StartAll";
                            colObj["Suggest"] =  colObj["EditEnum"]?colObj["EditEnum"]:colObj["Enum"];

                            // colObj["Icon"] = "Defaults";
                            colObj["Defaults"] = colObj["EditEnum"];

                            colObj["Format"] = newFormat;
                            colObj["EditFormat"] = newFormat;
                            colObj["Button"] = "Defaults";
                        }

                    }
                });
            }
        });

        /** ----------------------------------------------------------------
        -------------------------Cols행 초기설정----------------------------
        ------------------------------- 끝 ---------------------------------
        -----------------------------------------------------------------**/

        /** ----------------------------------------------------------------
        -------------------------Vplus 함수 sheet에 바인딩 -----------------
        -------------------------------시작---------------------------------
        -----------------------------------------------------------------**/
        // ibSheet AutoFocus할 Value or Row 셋팅
        obj.options.vplus.vpGetFocus = function () {
            var _sheetObj = {},
                _keyCols = [],
                _row = {},
                _val = "",
                _rtnVal = ""; // 0: sheetobj, 1: row, 2:value

            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if (args.length == 1 || Array.isArray(args)) {
                _sheetObj = args[0];
                _row = args[1];
                _val = args[2];
            } else {
                _sheetObj = args.sheet;
                _row = vChk.nvl(args.row, {});
                _val = vChk.nvl(args.val, "");
            } // 조회된 값이 하나도 없으면 return


            if (_sheetObj.getDataRows().length === 0) {
                return _sheetObj;
            } // 첫번째 행으로 초기화

            _row = _row == "init" ? _sheetObj.getRowById("AR1") : _row; // sheet에 셋팅된 FocusColumn

            var _focusCols = _sheetObj.options.Cfg.AutoFocusCol; // 파라미터로 넘긴 AutoFocusCol:0 또는 속성이 없는 경우, AutoFocus를 뺀다.

            if (vChk.nvl(_focusCols, 0) == 0) {
                return _sheetObj;
            } // 파라미터로 넘긴 AutoFocusCol:"" 인 경우, 자동으로 포커싱한 Row 객체를 넘긴다.
            else if (_focusCols == "") {
                _sheetObj.options.vplus.focusVal = _row || _sheetObj.getFocusedRow();
            } // 파라미터로 넘긴 AutoFocusCol:"KEY_VAL, KEY_VAL2"인 경우, 자동으로 포커싱한 Value를 넘긴다.
            else {
                _keyCols = _focusCols.split(",").map(function (item) {
                    return item.trim();
                });

                _keyCols.forEach(function (_col, index) {
                    _rtnVal += vChk.nvl((_row || _sheetObj.getFocusedRow() || _sheetObj.getFirstRow())[_col], "") + (index != (_keyCols.length-1) ? "‡" : "");
                });

                _sheetObj.options.vplus.focusVal = _val || _rtnVal;
            }

            return _sheetObj;
        }; // ibSheet 셋팅된 값으로 AutoFocus

        obj.options.vplus.vpSetFocus = function () {
            var _sheetObj = {},
                _row = {},
                _col = "",
                _val = ""; // 0: sheetobj, 1: row, 2:col, 3:value

            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            if (args.length == 1 || Array.isArray(args)) {
                _sheetObj = args[0];
                _row = args[1];
                _col = args[2];
                _val = args[3];
            } else {
                _sheetObj = args.sheet;
                _row = vChk.nvl(args.row, {});
                _col = vChk.nvl(args.col, "");
                _val = vChk.nvl(args.val, "");
            }

            _col = _col || _sheetObj.options.Cfg.AutoFocusCol;
            _val = _val || _sheetObj.options.vplus.focusVal; // 조회된 값이 하나도 없으면 return

            if (_sheetObj.getDataRows().length <= 0) { return; }

            if (vChk.isEmpty(_val)) {
                _sheetObj.focus(_sheetObj.getFirstVisibleRow());
            } else {
                // 값이 들어 있는 경우
                if (vChk.isEmpty(_row)) {
                    // 셋팅된 Row 객체를 return 한다.
                    if ((typeof _val === "undefined" ? "undefined" : typeof _val) == "object") {
                        _row = _val;
                    } // key와 value로 원하는 row를 return 시킨다.
                    else {
                        var values = vChk.nvl(_val,"").split("‡"), keys = _col.split(",").map(function(_column){return _column.trim();}),
                        rtnRows = _fnRecursive(_fnFindRowsFromValue, _sheetObj.getDataRows(), keys, values, 0, keys.length+1);
                        _row = rtnRows[0];
                    }
                }

                _sheetObj.focus(vChk.nvl(_row, _sheetObj.getFocusedRow() || _sheetObj.getRowById("AR1")));
            }

            // reducing
            function _fnRecursive(fn, _rows, _cols, _values, _index, end) {
                var result = _rows, index = _index + 1;
                if (index==end) {
                    return result;
                }
                result = _fnRecursive(fn, fn(result, _cols.slice(index-1,index)[0], _values.slice(index-1,index)[0]), _cols, _values, index, end);
                return result;
            }

            // 특정값으로 원하는 rows를 찾는 로직
            function _fnFindRowsFromValue(rowsParam, colParam, valueParam) {
                return rowsParam.filter(function(_rowsParam) {
                    if(_rowsParam[colParam] == valueParam) {
                        return _rowsParam;
                    }
                });
            }
        };

        /** ----------------------------------------------------------------
        -------------------------Vplus 함수 sheet에 바인딩 -----------------
        -------------------------------끝-----------------------------------
        -----------------------------------------------------------------**/

        /** ----------------------------------------------------------------
        ------------------------Solid행 초기설정----------------------------
        -------------------------------시작---------------------------------
        -----------------------------------------------------------------**/
        // Solid행 설정이 없는 경우 Solid 배열 생성
        obj.options.Solid ??= [];

        // ----------------------------------------------------------------
        // ---------Solid생성 전 초기값 여부 확인 할당---------------------
        // ----------------------------------------------------------------
        var solidObjArray = obj.options.Solid.map(data => solidInitSetting(data));

        // Kind에 따라 Solid 초기 셋팅
        function solidInitSetting(data) {
            var kind = vChk.nvl(data.Kind,""), init = {};
            switch (kind) {
                case "Group":
                    init =  {
                        "Kind":"Group",         //솔리드 행의 종류
                        "Space":0,              //솔리드 행의 위치
                    };
                    // 초기 설정 값에 파라미터로 들어온 객체를 update && push를 하고 해당 객체를 return한다.
                    return Object.assign(init,data);
                case "Search":
                    init = {
                        "Kind": "Search",           // 솔리드 행의 종류
                        "Space": 1,                 // 솔리드 행의 위치

                        // 각 셀의 기능 정의
                        Cells: "Expression,Spacer1,Filter,Select,Mark,FindPrev,Find,Clear,Spacer2", // 솔리드 행 내에 Cell 생성.
                                //Expression, Filter, Select, Mark, Find, FindPrev, Clear는 내장 설정 예약어
                        Expression: { // 검색하기 위한 expression 설정
                            Action: "Last", // expression 셀 내용이 변경되었을때 취할 동작에 대한 설정
                                            //Filter,Select,Mark,Find,FindPrev,Last 를 설정할 수 있음(Last는 이전 행동을 계속함.)
                            Left: "5", // 셀 좌측에 지정한 px 만큼의 빈 공간 생성
                            MinWidth: "90", // 최소 너비 px 단위
                            // MaxWidth: "300",
                            EmptyValue: "<s>검색어를 입력해 주세요</s>"  // input의 placeholder 속성과 동일한 기능
                        },
                        Spacer1: {   // 중간 공백 셀 정의
                            Width: "10",Type: "Empty",CanFocus:0
                        },
                        Spacer2: {
                            Width: "10",Type: "Empty",CanFocus:0
                        },
                        Filter: {   //필터 기능 버튼 (Expression 셀에 입력한 글자를 바탕으로 전체 열에 대해 필터링 실시)
                            ButtonText: "필터"
                        },
                        Select: {   //선택 기능 버튼 (Expression 셀에 입력한 글자를 바탕으로 행단위로 선택)
                            ButtonText: "선택"
                        },
                        Mark: {     //표시 기능 버튼 (Expression 셀에 입력한 글자를 포함하고 있는 행에 배경색을 변경)
                            ButtonText: "마킹"
                        },
                        FindPrev: {     //이전방향 찾기 기능 버튼 (Expression 셀에 입력한 글자를 포함하고 있는 셀을 찾음. 아래로 계속 찾기 가능)
                            ButtonText: "이전방향 찾기",Width: "80"
                        },
                        Find: {     //찾기 기능 버튼 (Expression 셀에 입력한 글자를 포함하고 있는 셀을 찾음. 아래로 계속 찾기 가능)
                            ButtonText: "찾기"
                        },
                        Clear: {    //클리어 기능 버튼 (위에서 한 행위(필터,선택,마킹등을 원상복귀))
                            ButtonText: "클리어",Width: "50"
                        }
                    };
                    // 초기 설정 값에 파라미터로 들어온 객체를 update && push를 하고 해당 객체를 return한다.
                    return Object.assign(init,data);
                case "Space":
                    init = {
                        "Kind":  "Space",
                        "Space":  1
                    };
                    // 초기 설정 값에 파라미터로 들어온 객체를 update && push를 하고 해당 객체를 return한다.
                    return Object.assign(init,data);
                default:
                    return "";
            }
        }

        obj.options["Solid"] = solidObjArray;
        /** ----------------------------------------------------------------
        ------------------------Solid행 초기설정----------------------------
        --------------------------------끝----------------------------------
        -----------------------------------------------------------------**/

        /** ----------------------------------------------------------------
        -------------------------Events 초기설정----------------------------
        -------------------------------시작---------------------------------
        -----------------------------------------------------------------**/
        // 각 화면에서 실행할 PageEvent 객체 생성
        obj.options.PageEvent = {};

        // Events 설정이 없는 경우 Events 객체 생성
        obj.options.Events ??= {};

        // ----------------------------------------------------------------
        // ---------이벤트 타기전 AOP 여부 확인 변수 할당------------------
        // ----------------------------------------------------------------
        // 처음 조회 시 타는 이벤트
        if (obj.options["Events"]["onRenderFirstFinish"]) {
            obj.options.PageEvent["onRenderFirstFinish"] = obj.options["Events"]["onRenderFirstFinish"];
        }

        // 데이터 가져와서 Rendering 전 이벤트
        if (obj.options["Events"]["onBeforeDataLoad"]) {
            obj.options.PageEvent["onBeforeDataLoad"] = obj.options["Events"]["onBeforeDataLoad"];
        }

        // 저장 전
        if (obj.options["Events"]["onBeforeSave"]) {
            obj.options.PageEvent["onBeforeSave"] = obj.options["Events"]["onBeforeSave"];
        }

        // 조회 후(auto Unblock을 안하는 경우)
        if (obj.options["Events"]["onSearchFinishNonBlock"]) {
            obj.options.PageEvent["onSearchFinishNonBlock"] = true;
            obj.options.PageEvent["onSearchFinish"] = obj.options["Events"]["onSearchFinishNonBlock"];
        }

        // 조회 후
        if (obj.options["Events"]["onSearchFinish"]) {
            obj.options.PageEvent["onSearchFinish"] = obj.options["Events"]["onSearchFinish"];
        }

        // 저장 후 evtParam.result를 여러 분기로 나눠서 작업을 하려고 할 때 호출되는 이벤트(auto Unblock을 안하는 경우)
        if (obj.options["Events"]["onAfterSaveNonBlock"]) {
            obj.options.PageEvent["onAfterSaveNonBlock"] = true;
            obj.options.PageEvent["onAfterSave"] = obj.options["Events"]["onAfterSaveNonBlock"];
        }

        // 저장 후 evtParam.result를 여러 분기로 나눠서 작업을 하려고 할 때 호출되는 이벤트
        if (obj.options["Events"]["onAfterSave"]) {
            obj.options.PageEvent["onAfterSave"] = obj.options["Events"]["onAfterSave"];
        }

        // 저장 후 성공 시(auto Unblock을 안하는 경우)
        if (obj.options["Events"]["onAfterSaveSuccessNonBlock"]) {
            obj.options.PageEvent["onAfterSaveSuccessNonBlock"] = true;
            obj.options.PageEvent["onAfterSave"] = obj.options["Events"]["onAfterSaveSuccessNonBlock"];
        }

        // 저장 후 성공 시
        if (obj.options["Events"]["onAfterSaveSuccess"]) {
            obj.options.PageEvent["onAfterSaveSuccess"] = true;
            obj.options.PageEvent["onAfterSave"] = obj.options["Events"]["onAfterSaveSuccess"];
        }

        // 삭제 후
        if (obj.options["Events"]["onAfterDelete"]) {
            obj.options.PageEvent["onAfterDelete"] = obj.options["Events"]["onAfterDelete"];
        }

        // 행 선택 전 이벤트
        if (obj.options["Events"]["onBeforeFocus"]) {
            obj.options.PageEvent["onBeforeFocus"] = obj.options["Events"]["onBeforeFocus"];
        }

        // 행 선택 이벤트
        if (obj.options["Events"]["onFocus"]) {
            obj.options.PageEvent["onFocus"] = obj.options["Events"]["onFocus"];
        }

        // 행 이동 전 이벤트
        if (obj.options["Events"]["onBeforeRowChange"]) {
            obj.options.PageEvent["onBeforeRowChange"] = true;
            obj.options.PageEvent["onBeforeFocus"] = obj.options["Events"]["onBeforeRowChange"];
        }

        // 행 이동 이벤트
        if (obj.options["Events"]["onRowChange"]) {
            obj.options.PageEvent["onRowChange"] = true;
            obj.options.PageEvent["onFocus"] = obj.options["Events"]["onRowChange"];
        }

        // (debounce) 행 이동 이벤트
        if (obj.options["Events"]["onDebounceRowChange"]) {
            obj.options.PageEvent["onDebounceRowChange"] = true;
            obj.options.PageEvent["onFocus"] = obj.options["Events"]["onDebounceRowChange"];
        }

        // 행 칼럼 이동 전 이벤트
        if (obj.options["Events"]["onBeforeRowColChange"]) {
            obj.options.PageEvent["onBeforeRowColChange"] = true;
            obj.options.PageEvent["onBeforeFocus"] = obj.options["Events"]["onBeforeRowColChange"];
        }

        // 행 칼럼 이동 이벤트
        if (obj.options["Events"]["onRowColChange"]) {
            obj.options.PageEvent["onRowColChange"] = true;
            obj.options.PageEvent["onFocus"] = obj.options["Events"]["onRowColChange"];
        }

        // 데이터 더블 클릭 이벤트
        if (obj.options["Events"]["onBodyDblClick"]) {
            obj.options.PageEvent["onBodyDblClick"] = true;
            obj.options.PageEvent["onDblClick"] = obj.options["Events"]["onBodyDblClick"];
        }

        // 데이터 클릭 이벤트
        if (obj.options["Events"]["onBodyClick"]) {
            obj.options.PageEvent["onBodyClick"] = true;
            obj.options.PageEvent["onClick"] = obj.options["Events"]["onBodyClick"];
        }

        // 사용자의 입력에 의해 셀의 값이 수정된 후 호출되는 이벤트
        if (obj.options["Events"]["onAfterChange"]) {
            obj.options.PageEvent["onAfterChange"] = obj.options["Events"]["onAfterChange"];
        }

        // 시트의 내용을 다운로드 시 완료되면 발생하는 이벤트
        if (obj.options["Events"]["onExportFinish"]) {
            obj.options.PageEvent["onExportFinish"] = obj.options["Events"]["onExportFinish"];
        }

        // 버튼클릭 이벤트
        if (obj.options["Events"]["onButtonClick"]) {
            obj.options.PageEvent["onButtonClick"] = obj.options["Events"]["onButtonClick"];
        }

        // 신규행 바로 삭제 이벤트
        if (obj.options["Events"]["onAddedRowDelete"]) {
            obj.options.PageEvent["onAddedRowDelete"] = obj.options["Events"]["onAddedRowDelete"];
        }

        // 파일 업로드에서 파일 선택 이벤트
        if (obj.options["Events"]["onSelectFile"]) {
            obj.options.PageEvent["onSelectFile"] = obj.options["Events"]["onSelectFile"];
        }

        // 파일 업로드에서 업로드 완료시 이벤트
        if (obj.options["Events"]["onImportFinish"]) {
            obj.options.PageEvent["onImportFinish"] = obj.options["Events"]["onImportFinish"];
        }

        // 파일 업로드에서 업로드 완료시 이벤트
        if (obj.options["Events"]["onKeyDown"]) {
            obj.options.PageEvent["onKeyDown"] = obj.options["Events"]["onKeyDown"];
        }

        // ----------------------------------------------------------------
        // ----------화면에서 호출한 이벤트 AOP 로직 실행------------------
        // ----------------------------------------------------------------
        // 처음 조회 시 타는 이벤트
        if (obj.options.PageEvent["onRenderFirstFinish"]) {
            obj.options["Events"]["onRenderFirstFinish"] = function(evtParam) {
                if (evtParam.sheet.options.PageEvent && evtParam.sheet.options.PageEvent["onRenderFirstFinish"]) {
                    evtParam.sheet.options.Cfg.hasOwnProperty('CountInfoElementId') && evtParam.sheet.setCountInfoElement(evtParam.sheet.options.Cfg.CountInfoElementId)
                    // [Filter행 초기설정] 공백제거, upper한 값으로 값들을 비교
  //                    evtParam.sheet.setFilter("vPlusFilter", function(obj) {
  //                        // 보여지는 모든 칼럼에 설정
  //                        var cols = evtParam.sheet.getCols;
  //                        cols.forEach(function(_col) {
  //                            return obj.Row[_col].indexOf(obj.Row[_col].toUpperCase().replace(/\s/gi,'')) > -1;
  //                        });
  //                    },1);
  //
                    // 세션이 종료된게 아니라면 해당 페이지의 이벤트를 호출한다.
                    evtParam.sheet.options.PageEvent["onRenderFirstFinish"](evtParam);
                }
            }
        }


        // 그리드 저장 전 이벤트
        obj.options["Events"]["onBeforeSave"] = function(evtParam) {
            let sheet = evtParam.sheet;
            let saveRows = sheet.getRowsByStatus("Added,Changed,!Deleted");
            let userOptions = sheet.getUserOptions();

            let allCols = [...(userOptions.LeftCols || []), ...(userOptions.Cols || []), ...(userOptions.RightCols || [])];

            for (let rowObj of saveRows) {
                let rowIndex = sheet.getRowIndex(rowObj);
                for (let colInfo of allCols) {
                    // RelatedRequired가 정의된 컬럼만 처리
                    if (colInfo.RelatedRequired) {
                        let relatedKey = colInfo.RelatedRequired;
                        let relatedKeyValue = sheet.getValue(rowObj, relatedKey);
                        let currentValue = sheet.getValue(rowObj, colInfo.Name);
                        if(relatedKeyValue && !currentValue){
                            let errorMessage =
                            rowIndex +" 행의 "+ gfnIbGetHeaderName(sheet, colInfo.RelatedRequired) + "에 값이 있는 경우, " +  gfnIbGetHeaderName(sheet, colInfo.Name)+"의 값은 필수입니다.";
                            alert(errorMessage);
                            sheet.selectRow(rowIndex);
                            $.unblockUI();
                            return true;
                        }
                    }
                }
            }

            // 기존 이벤트 로직 호출
            if (obj.options.PageEvent["onBeforeSave"]) {
                evtParam.sheet.options.PageEvent["onBeforeSave"](evtParam);
            }
        };

        // 데이터 조회 후 화면에 Rendering 되기 전
        obj.options["Events"]["onBeforeDataLoad"] = function(evtParam) {

            if (evtParam.sheet.options.PageEvent
                    && evtParam.sheet.options.PageEvent["onBeforeDataLoad"]) {

                // 조회 결과 데이터
                gfnTreeObjForLoop(evtParam.data, "Items", function(row, col) {
                    if (typeof row[col] === "string") {
                        row[col] = row[col].replace(/\\r/gi,'');
                    }
                });

                // 세션이 종료된게 아니라면 해당 페이지의 이벤트를 호출한다.
                if (obj.options.PageEvent["onBeforeDataLoad"]) {
                    evtParam.sheet.options.PageEvent["onBeforeDataLoad"](evtParam);
                }
            }
        };

        // 조회 후
        if (obj.options.PageEvent["onSearchFinish"]) {
            obj.options["Events"]["onSearchFinish"] = function(evtParam) {
                // 공통로직 처리!!!!!
                // block 관련 변수 지정
                var noblock = vChk.useObjsVal(obj.options.vplus,'noblock')        // no block 처리
                  , blockId = vChk.useObjsVal(obj.options.vplus,'blockId')        // element block 처리
                  , pageBlock = vChk.useObjsVal(obj.options.vplus,'pageBlock');   // page Block 처리

                // block hide 처리
                // pageBlock hide 처리
                if (!noblock && pageBlock) {
                    vPblock.hideCustomAllSuppressMessage(false);
                }

                // element unblock 처리
                else if (!noblock && blockId) {
                    vPblock.hide(blockId);
                }

                if (evtParam.sheet.options.PageEvent
                        && evtParam.sheet.options.PageEvent["onSearchFinish"]) {
                    // blcok hide 처리
                    vPblock.hideCustomAllSuppressMessage(false);

                    // ibSheet 셋팅된 값으로 AutoFocus
                    !evtParam.sheet.IgnoreFocused && evtParam.sheet.options.vplus.vpSetFocus(evtParam.sheet);

                    // AutoFocus값 첫번째 행으로 초기화
                    evtParam.sheet = evtParam.sheet.options.vplus.vpGetFocus(evtParam.sheet, "init");

                    // 세션이 종료된게 아니라면 해당 페이지의 이벤트를 호출한다.
                    evtParam.sheet.options.PageEvent["onSearchFinish"](evtParam);
                }
            }
        }

        // 조회 후(auto Unblock을 안하는 경우)
        if (obj.options.PageEvent["onSearchFinishNonBlock"]) {
            obj.options["Events"]["onSearchFinish"] = function(evtParam) {

                if (evtParam.sheet.options.PageEvent
                        && evtParam.sheet.options.PageEvent["onSearchFinishNonBlock"]) {

                    // ibSheet 셋팅된 값으로 AutoFocus
                    !evtParam.sheet.IgnoreFocused && evtParam.sheet.options.vplus.vpSetFocus(evtParam.sheet);

                    // AutoFocus값 첫번째 행으로 초기화
                    evtParam.sheet = evtParam.sheet.options.vplus.vpGetFocus(evtParam.sheet, "init");

                    // 세션이 종료된게 아니라면 해당 페이지의 이벤트를 호출한다.
                    evtParam.sheet.options.PageEvent["onSearchFinish"](evtParam);
                }
            }
        }

        // 엑셀 다운로드 시 칠해진 배경색 기존으로 돌리는 옵션
        if (vChk.useObjsVal(obj.options.Cfg,"ExcelCanEditColor") == "1") {
            obj.options["Events"]["onExportFinish"] = function(evtParam) {

                // 엑셀 다운로드 시 칠해진 배경색 기존으로 돌리는 액션
                if(evtParam.result && evtParam.type == "EXCEL"){
                    gfnIbBeforeExcelDown(evtParam.sheet, false);
                }

                // 기존에 이벤트가 정의 되어 있는 경우
                if (obj.options.PageEvent["onExportFinish"]) {
                    // 세션이 종료된게 아니라면 해당 페이지의 이벤트를 호출한다.
                    evtParam.sheet.options.PageEvent["onExportFinish"](evtParam);
                }
            }
        }

        // 버튼클릭 이벤트
        if (obj.options.PageEvent["onButtonClick"]) {
            obj.options["Events"]["onButtonClick"] = function(evtParam) {
                if (evtParam.row.Kind == "Filter") {
                    return;
                }
                evtParam.sheet.options.PageEvent["onButtonClick"](evtParam);
            }
        }

        // 신규행 바로 삭제 이벤트
        if (obj.options.PageEvent["onAddedRowDelete"]) {
            obj.options["Events"]["onAddedRowDelete"] = function(evtParam) {
                evtParam.sheet.options.PageEvent["onAddedRowDelete"](evtParam);
            }
        }

        // 파일 업로드에서 파일 선택 이벤트
        if (obj.options.PageEvent["onSelectFile"]) {
            obj.options["Events"]["onSelectFile"] = function(evtParam) {
                let params = {block:{id:"body"}};
                vPblock.setBlockMode(params, "excelUp");
                vPblock.showCommonBlockFn(params, vPblock.blockMsg.excelUp);
                evtParam.sheet.options.PageEvent["onSelectFile"](evtParam);
            }
        }

        // 파일 업로드에서 업로드 완료시 이벤트
        if (obj.options.PageEvent["onImportFinish"]) {
            obj.options["Events"]["onImportFinish"] = function(evtParam) {
                vPblock.hideCommonBlockFn({block:{id:"body"}}, false);
                evtParam.sheet.options.PageEvent["onImportFinish"](evtParam);
            }
        }

        // 저장 성공시 공통으로 처리하는 로직
        function _fnSaveEvent(evtParam) {
            // autoFocus할 Value or Row 셋팅
            evtParam.sheet = evtParam.sheet.options.vplus.vpGetFocus(evtParam.sheet);
            // 세션이 종료된게 아니라면 해당 페이지의 이벤트를 호출한다.
            evtParam.sheet.options.PageEvent["onAfterSave"](evtParam);
        }

        // 삭제 저장시 공통으로 처리하는 로직
        function _fnSaveForDelete(_obj, evtParam, fn) {
            // 삭제한 상태이고, onAfterDelete라는 이벤트가 존재할 때 아래 로직을 탄다.
            if (vChk.useObjsVal(evtParam.sheet,"vDelete") && _obj.options.PageEvent["onAfterDelete"]) {
                evtParam.sheet.vDelete = false;
                // 저장 후 에러
                if (evtParam.result !== 0 ) {
                    gfnIbSheetSaveErrAlert(evtParam);
                    setTimeout(function(){
                        gfnIbRevertRow(evtParam.sheet, evtParam.sheet.getFocusedRow());
                    }, 1);
                }
                // 서버 저장이 제대로 동작
                else {
                    evtParam.sheet.options.PageEvent["onAfterDelete"](evtParam);
                }
            // 일반적인 저장 형태일 때 동작
            } else {
                fn(_obj,evtParam);
            }
        }

        // 저장 후 evtParam.result를 여러 분기로 나눠서 작업을 하려고 할 때 호출되는 이벤트
        if (obj.options.PageEvent["onAfterSave"]) {
            obj.options["Events"]["onAfterSave"] = function(evtParam) {
                // 공통로직 처리!!!!!
                // pageBlock hide 처리
                vPblock.hideCustomAllSuppressMessage(false);

                if (evtParam.sheet.options.PageEvent
                        && evtParam.sheet.options.PageEvent["onAfterSave"]) {
                    _fnSaveForDelete(obj, evtParam, function(_obj, _evtParam) {

                        _fnSaveEvent(_evtParam);
                    });
                }
            }
        }

        // 저장 후 evtParam.result를 여러 분기로 나눠서 작업을 하려고 할 때 호출되는 이벤트(auto Unblock을 안하는 경우)
        if (obj.options.PageEvent["onAfterSaveNonBlock"]) {
            obj.options["Events"]["onAfterSave"] = function(evtParam) {
                if (evtParam.sheet.options.PageEvent
                        && evtParam.sheet.options.PageEvent["onAfterSaveNonBlock"]) {
                    _fnSaveForDelete(obj, evtParam, function(_obj, _evtParam) {
                        _fnSaveEvent(_evtParam);
                    });
                }
            }
        }

        // 저장 후 성공 시(auto Unblock을 안하는 경우)
        if (obj.options.PageEvent["onAfterSaveSuccessNonBlock"]) {
            obj.options["Events"]["onAfterSave"] = function(evtParam) {
                if (evtParam.sheet.options.PageEvent
                        && evtParam.sheet.options.PageEvent["onAfterSaveSuccessNonBlock"]) {
                    _fnSaveForDelete(obj, evtParam, _fnAfterDeleteCallBack);
                }
            }
        }

        // 저장 후 성공 시
        if (obj.options.PageEvent["onAfterSaveSuccess"]) {
            obj.options["Events"]["onAfterSave"] = function(evtParam) {

                if(evtParam.response.status == "403"){
                    //window.location.href = "/error/403";
                    alert(comm_msg.getMsg(comm_msg.ERR400));
                }else{
                    // 공통로직 처리!!!!!
                    // pageBlock hide 처리

                    if (evtParam.sheet.options.PageEvent
                            && evtParam.sheet.options.PageEvent["onAfterSaveSuccess"]) {
                        _fnSaveForDelete(obj, evtParam, _fnAfterDeleteCallBack);
                    }
                }
                vPblock.hideCustomAllSuppressMessage(false);

                return true; // 아이비시트 메세지를 공통화된 alert 처리로 변경하기 위한 처리
            }
        }

        // [private] 삭제 후 callback function
        function _fnAfterDeleteCallBack(_, shtParam) {
            // 저장 후 에러
            if (shtParam.result !== 0 ) {
                gfnIbSheetSaveErrAlert(shtParam);
            }
            // 서버 저장이 제대로 동작
            else {

                _fnSaveEvent(shtParam);
            }
        }

        // 행 선택 전 FOCUS 안되는 경우 체크
        if (obj.options.PageEvent["onBeforeFocus"]) {
            obj.options["Events"]["onBeforeFocus"] = function(evtParam) {

                if (evtParam.sheet.options.PageEvent && evtParam.sheet.options.PageEvent["onBeforeFocus"]) {

                    // 첫 조회가 아니고, 이전행과 FOCUS하려고 하는 행이 다른 경우
                    if (vChk.useObjsVal(evtParam.orow,"id") != evtParam.row.id) {
                        // 세션이 종료된게 아니라면 해당 페이지의 이벤트를 호출한다.
                        return evtParam.sheet.options.PageEvent["onBeforeFocus"](evtParam);
                    }
                }
            }
        }

        // 행 선택 FOCUS 이벤트 공통화
        if (obj.options.PageEvent["onFocus"]) {
            obj.options["Events"]["onFocus"] = function(evtParam) {

                if (evtParam.sheet.options.PageEvent && evtParam.sheet.options.PageEvent["onFocus"]) {

                    // 이전 행과 신규행이 다른 경우
                    if (vChk.useObjsVal(evtParam.orow,"id") != evtParam.row.id) {
                        // 세션이 종료된게 아니라면 해당 페이지의 이벤트를 호출한다.
                        evtParam.sheet.options.PageEvent["onFocus"](evtParam);
                    }
                }
            }
        }

        // 행 이동 전 이벤트 공통화
        if (obj.options.PageEvent["onBeforeRowChange"]) {
            obj.options["Events"]["onBeforeFocus"] = function(evtParam) {

                if (evtParam.sheet.options.PageEvent && evtParam.sheet.options.PageEvent["onBeforeRowChange"]) {

                    // 첫 조회가 아니고, 이전행과 FOCUS하려고 하는 행이 다른 경우
                    if (vChk.useObjsVal(evtParam.orow,"id") != evtParam.row.id) {
                        // 세션이 종료된게 아니라면 해당 페이지의 이벤트를 호출한다.
                        return evtParam.sheet.options.PageEvent["onBeforeFocus"](evtParam);
                    }
                }
            }
        }

        // (debounce) 행 이동 이벤트
        if (obj.options.PageEvent["onDebounceRowChange"]) {
            obj.options["Events"]["onFocus"] = vpDebounce(function(evtParam) {

                if (evtParam.sheet.options.PageEvent && evtParam.sheet.options.PageEvent["onDebounceRowChange"]) {

                    // 이전 행과 신규행이 다른 경우
                    if (vChk.useObjsVal(evtParam.orow,"id") != evtParam.row.id) {
                        // 세션이 종료된게 아니라면 해당 페이지의 이벤트를 호출한다.
                        evtParam.sheet.options.PageEvent["onFocus"](evtParam);
                    }
                }
            });
        }

        // 행 이동 이벤트
        if (obj.options.PageEvent["onRowChange"]) {
            obj.options["Events"]["onFocus"] = function(evtParam) {

                if (evtParam.sheet.options.PageEvent && evtParam.sheet.options.PageEvent["onRowChange"]) {

                    // 이전 행과 신규행이 다른 경우
                    if (vChk.useObjsVal(evtParam.orow,"id") != evtParam.row.id) {
                        // 세션이 종료된게 아니라면 해당 페이지의 이벤트를 호출한다.
                        evtParam.sheet.options.PageEvent["onFocus"](evtParam);
                    }
                }
            }
        }

        // 행 칼럼 이동 전 이벤트 공통화
        if (obj.options.PageEvent["onBeforeRowColChange"]) {
            obj.options["Events"]["onBeforeFocus"] = function(evtParam) {

                if (evtParam.sheet.options.PageEvent && evtParam.sheet.options.PageEvent["onBeforeRowColChange"]) {

                    return evtParam.sheet.options.PageEvent["onBeforeFocus"](evtParam);
                }
            }
        }

        // 행 칼럼 이동 이벤트 공통화
        if (obj.options.PageEvent["onRowColChange"]) {
            obj.options["Events"]["onFocus"] = function(evtParam) {

                if (evtParam.sheet.options.PageEvent && evtParam.sheet.options.PageEvent["onRowColChange"]) {

                    // 세션이 종료된게 아니라면 해당 페이지의 이벤트를 호출한다.
                    evtParam.sheet.options.PageEvent["onFocus"](evtParam);
                }
            }
        }

        // 데이터 클릭 공통화
        if (obj.options.PageEvent["onBodyClick"]) {
            obj.options["Events"]["onClick"] = function(evtParam) {

                if (evtParam.sheet.options.PageEvent
                        && evtParam.sheet.options.PageEvent["onBodyClick"]) {

                    //데이터 행이 아닐 때 제외
                    if (evtParam.row.Kind != "Data") { return; }

                    // 세션이 종료된게 아니라면 해당 페이지의 이벤트를 호출한다.
                    evtParam.sheet.options.PageEvent["onClick"](evtParam);
                }
            }
        }

        // 데이터 더블 클릭 공통화
        if (obj.options.PageEvent["onBodyDblClick"]) {
            obj.options["Events"]["onDblClick"] = function(evtParam) {

                if (evtParam.sheet.options.PageEvent
                        && evtParam.sheet.options.PageEvent["onBodyDblClick"]) {

                    //데이터 행이 아닐 때 제외
                    if (evtParam.row.Kind != "Data") { return; }

                    // 세션이 종료된게 아니라면 해당 페이지의 이벤트를 호출한다.
                    evtParam.sheet.options.PageEvent["onDblClick"](evtParam);
                }
            }
        }

        // 사용자의 입력에 의해 셀의 값이 수정된 후 호출되는 이벤트
        if (obj.options.PageEvent["onAfterChange"]) {
            obj.options["Events"]["onAfterChange"] = function(evtParam) {

                if (evtParam.sheet.options.PageEvent
                        && evtParam.sheet.options.PageEvent["onAfterChange"]) {

                    //신규행일 때 수정시
                    if (evtParam.row.Added) {
                        evtParam.row.createdRowModified = true;
                    }

                    // 세션이 종료된게 아니라면 해당 페이지의 이벤트를 호출한다.
                    evtParam.sheet.options.PageEvent["onAfterChange"](evtParam);
                }
            }
        }

        // 키 다운 이벤트 공통화
        if (obj.options.PageEvent["onKeyDown"]) {
            obj.options["Events"]["onKeyDown"] = function(evtParam) {

                if (evtParam.sheet.options.PageEvent
                        && evtParam.sheet.options.PageEvent["onKeyDown"]) {
                    if(evtParam.prefix == "Ctrl" && (evtParam.key == 46 || evtParam.key == 88)) {
                        let sheet = evtParam.sheet;

                        let veCol = sheet.getCols("Visible"); //숨겨진 컬럼을 제외하고 컬럼을 추출
                        let delCheck = false; //삭제 컬럼 있는지 체크

                        for(i=0;i<=veCol.length;i++){ //컬럼을 loop를 돌면서 편집 가능한 컬럼이 있는지 찾는다.

                            if(sheet.getAttribute(null, veCol[i], "Name") == "CHK_DEL"){ //삭제컬럼이 있으면
                                if (sheet.getCanEdit(sheet.getFocusedRow(), "CHK_DEL") == 1) { //삭제 컬럼이 편집이 가능하면
                                    delCheck = true;
                                } else { //삭제 컬럼 없으면 ctrl+x, ctrl+delete 동작 차단
                                    delCheck = false
                                    break;
                                }
                            }
                        }

                        //삭제 컬럼 유무를 체크해서 ctrl+x, ctrl+delete 동작 제어
                        if(!delCheck) return true;
                    }

                    // 세션이 종료된게 아니라면 해당 페이지의 이벤트를 호출한다.
                    evtParam.sheet.options.PageEvent["onKeyDown"](evtParam);
                }
            }
        }

        // 마우스 오른쪽 클릭 시 시트에 설정된 메뉴가 화면에 보여지기전 호출되는 이벤트
  //        obj.options["Events"]["onReadMenu"] = function(evtParam) {
  //            if (evtParam.sheet.CanEdit != 1 && vChk.nvl(evtParam.sheet.ContextMenu,1) != 0) {
  //                return {
  //                    Items: [
  //                        {"Name":"다운로드","Caption":1},
  //                        {"Name":"Excel 다운로드","Value":"xls"},
  //                        {"Name":"text 다운로드","Value":"txt"},
  //                    ],
  //                    OnSave:function(item,_){//메뉴 선택시 발생 이벤트
  //                        switch(item.Value){
  //                            case 'xls':
  //                                try{
  //                                    this.Sheet.down2Excel({fileName:this.Sheet.id+".xlsx",sheetDesign:1,downCols:"Visible",merge:1});
  //                                }catch(e){
  //                                    if(e.message.indexOf("down2Excel is not a function")>-1){
  //                                        console.log("%c 경고","color:#FF0000"," : ibsheet-excel.js 파일이필요합니다.");
  //                                    }
  //                                }
  //                                break;
  //                            case 'txt':
  //                                try{
  //                                    this.Sheet.down2Text({fileName:this.Sheet.id+".txt",downCols:"Visible",merge:1});
  //                                }catch(e){
  //                                    vLog(e);
  //                                    if(e.message.indexOf("down2Text is not a function")>-1){
  //                                        console.log("%c 경고","color:#FF0000"," : ibsheet-excel.js 파일이필요합니다.");
  //                                    }
  //                                }
  //                                break;
  //                        }
  //                    },
  //                };
  //            }
  //        }
        /** ----------------------------------------------------------------
        -------------------------Events 초기설정----------------------------
        --------------------------------끝----------------------------------
        -----------------------------------------------------------------**/
        return obj; // 반드시 리턴해 줘야 함.
    }
    // [Code For vPlus] 4.beforeCreate End

    /**
     * object 복사
     */
    function clone(obj) {
        if (obj === null || typeof (obj) !== 'object') return obj;
        var copy = obj.constructor();
        for ( var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = clone(obj[attr]);
            }
        }
        return copy;
    }

    /*
    ibsheet7 migration functions
    */
    if (!_IBSheet.v7) _IBSheet.v7 = {};

    /*
     * ibsheet7 AcceptKey 속성 대응
     * param list
     * objColumn : 시트 생성시 Cols객체의 컬럼
     * str : ibsheet7 AcceptKeys에 정의했던 스트링
     */
    _IBSheet.v7.convertAcceptKeys = function (objColumn, str) {
      // EditMask를 통해 AcceptKeys를 유사하게 구현
      var acceptKeyArr = str.split("|");
      var mask = "";

      for (var i = 0; i < acceptKeyArr.length; i++) {
        switch (acceptKeyArr[i]) {
          case "E":
            mask += "|\\w";
            break;
          case "N":
            mask += "|\\d";
            break;
          case "K":
            mask += "|\\u3131-\\u314e|\\u314f-\\u3163|\\uac00-\\ud7a3"
            break;
          default:
            if (acceptKeyArr[i].substring(0, 1) == "[" && acceptKeyArr[i].substring(acceptKeyArr[i].length - 1) == "]") {
              var otherKeys = acceptKeyArr[i].substring(1, acceptKeyArr[i].length - 1);
              for (var x = 0; x < otherKeys.length; x++) {
                if (otherKeys[x] == "." || otherKeys[x] == "-") {
                  mask += "|\\" + otherKeys[x];
                } else {
                  mask += "|" + otherKeys[x];
                }
              }
            }
            break;
        }
      }
      objColumn.EditMask = "^[" + mask.substring(1) + "]*$";
    };
    //Date Format migration
    //exam)
    /*
    //데이터 로드 이벤트에서 호출합니다.
    options.Events.onBeforeDataLoad:function(obj){
      //날짜포맷 컬럼의 값을 ibsheet8에 맞게 변경하여 로드시킴
      IBSheet.v7.convertDateFormat(obj);
    }
    */
    _IBSheet.v7.convertDateFormat = function (obj) {
      var cdata = obj.data;
      var changeCol = {};
      //날짜 컬럼에 대한 포맷을 별도로 저장
      var cols = obj.sheet.getCols();
      for (var i = 0; i < cols.length; i++) {
        var colName = cols[i];

        if (obj.sheet.Cols[colName].Type == "Date") {
          //DataFormat이 없으면 EditFormat 이나 포맷에서 알파벳만 추출
          var format = (obj.sheet.Cols[colName].DataFormat) ? obj.sheet.Cols[colName].DataFormat : (obj.sheet.Cols[colName].EditFormat) ? obj.sheet.Cols[colName].EditFormat : obj.sheet.Cols[colName].Format.replace(/([^A-Za-z])+/g, "");
          changeCol[colName] = {
            format: format,
            length: format.length
          };
        }
      }

      if (Object.keys(changeCol).length !== 0) {
        var changeColKeys = Object.keys(changeCol);

        //DataFormat의 길이만큼 문자열을 자름
        for (var row = 0; row < cdata.length; row++) {
          for (var colName in cdata[row]) {
            if (changeColKeys.indexOf(colName) > -1) {
              // 문자열만 처리
              if (typeof ((cdata[row])[colName]) == "string") {
                //실제 값
                var v = (cdata[row])[colName];
                //MMdd만 값이 8자리 이상이면 중간에 4자리만 pick
                if (changeCol[colName].format == "MMdd" && v.length != 4) {
                  if (v.length > 7) {
                    v = v.substr(4, 4);
                  }
                } else {
                  //일반적으로 모두 포맷의 문자열 길이만큼 자름
                  v = v.substr(0, changeCol[colName].length);
                }
                //수정한 값을 원래 위치에 대입
                (cdata[row])[colName] = v;
              }
            }
          }
        }
      }
    };
    /* ibsheet7의 Tree 구조 Json 데이터를 ibsheet8 형식에 맞게 파싱해주는 메소드 */
    _IBSheet.v7.convertTreeData = function (data7) {
        var targetArr;
        var toString = Object.prototype.toString;
        var startLevel = 0;
        switch (toString.call(data7)) {
          case "[object Object]":
            if (!(data7["data"] || data7["Data"]) ||
              toString.call((data7["data"] || data7["Data"])) !== "[object Array]")
              return false;
            targetArr = (data7["data"] || data7["Data"]);
            break;
          case "[object Array]":
            targetArr = data7;
            break;
          default:
            return false;
        }

        targetArr = targetArr.reduce(function (accum, currentVal, curretIndex, array) {
          var cloneObj = clone(currentVal);
          if (cloneObj["HaveChild"]) {
            cloneObj["Count"] = true;
            delete cloneObj["HaveChild"];
          }
          if (accum.length == 0) {
            startLevel = parseInt(cloneObj["Level"]);
            delete cloneObj["Level"];
            accum.push(cloneObj);
          } else if (currentVal["Level"] <= startLevel) {
            startLevel = parseInt(cloneObj["Level"]);
            delete cloneObj["Level"];
            accum.push(cloneObj);
          } else if (currentVal["Level"]) {
            var parent = accum[accum.length - 1];
            for (var i = startLevel; i < parseInt(currentVal["Level"]); i++) {
              if (i === parseInt(currentVal["Level"]) - 1) {
                if (!parent.Items) {
                  parent.Items = [];
                }
                delete cloneObj["Level"];
                parent.Items.push(cloneObj);
              } else {
                if(parent.Items == null){
                  alert("트리 구성을 확인 할 수 없습니다.\n"+"［"+curretIndex+"］"+"의 행을 확인하십시오.");
                  array.splice(1);
                  return accum;
                }
                parent = parent.Items[parent.Items.length - 1];
              }
            }
          }
          return accum;
        }, []);

        delete data7["Data"];
        data7["data"] = targetArr;

      return data7;
    };
    /*
     * 일반 달력 사용시 사용 함수
     * @param   : id          - from혹은 to 날짜가 표시될 input 객체
     * @param   : format      - 날짜 형태 YMD
     * @version : 1.0.0.0,
     *
     * @sample1
     * <span>
     * <input  type="text" name="eDate" id="eDate" DATE='YMD'/>
     * <button class='calbtn' onclick='IBSheet.v7.IBS_Calendar("eDate","yyyy-MM-dd")'>달력</button>
     * </span>
     */
    _IBSheet.v7.IBS_Calendar = function(id,format) {
        event.preventDefault();
        var opt = {
                Date:$("#"+id).val(),
                Format:format,
                OnButtonClick:function(evt){
                    if(evt==2){ //지우기
                        $("#"+id).val("");
                    }
                    calObj.Close();
                },
        };
        if(format=="yyyy-MM")opt.Buttons = 4;
        function calPickCallBack(v){
            $("#"+id).val(IBSheet.dateToString(parseInt(v), format) );
        }
        var calObj = IBSheet.showCalendar(opt,{Tag:id},calPickCallBack);
    }
    /*------------------------------------------------------------------------------
    method : IBS_CopyForm2Sheet()
    desc  : Form객체에 있는 내용을 시트에 복사
    param list
    param : json 유형

    param 내부 설정값
    sheet : 값을 입력 받을 ibsheet 객체 (필수)
    form : copy할 폼객체 (필수)
    row : ibsheet 객체의 행 (default : 현재 선택된 행)
    sheetPreFiex : 맵핑할 시트의 SavaName 앞에 PreFix 문자 (default : "")
    formPreFiex : 맵핑할 폼객체의 이름 혹은 id 앞에  PreFix 문자 (default : "")
    -------------------------------------------------------------------------------*/
    _IBSheet.v7.IBS_CopyForm2Sheet = function(param) {
        var sheetobj,
            formobj,
            row,
            sheetPreFix,
            frmPreFix,
            col,
            colName,
            baseName,
            frmchild,
            fType,
            sType,
            sValue,
            masks = ['ymd', 'ym', 'bizNo', 'juminNo', 'hpNo', 's-ymd', 'hhmm'];

        if ((!param.sheet) || (typeof param.sheet.version != "function")) {
            _IBSheet.v7.IBS_ShowErrMsg("sheet 인자가 없거나 ibsheet객체가 아닙니다.");
            return false;
        }
        if (param.form == null || typeof param.form != "object" || param.form.tagName != "FORM") {
            _IBSheet.v7.IBS_ShowErrMsg("form 인자가 없거나 FORM 객체가 아닙니다.");
            return false;
        }

        sheetobj = param.sheet;
        formobj = param.form;
        row = param.row == null ? sheetobj.getFocusedRow() : param.row;
        sheetPreFix = param.sheetPreFix == null ? "" : param.sheetPreFix;
        frmPreFix = param.formPreFix == null ? "" : param.formPreFix;
        if (typeof row == "undefined") {
            _IBSheet.v7.IBS_ShowErrMsg("row 인자가 없고, 선택된 행이 존재하지 않습니다.");
            return;
        }

        //Sheet의 컬럼개수만큼 찾아서 HTML의 Form 각 Control에 값을 설정한다.
        //컬럼개수만큼 루프 실행
        cols = sheetobj.getCols();
        for (col = 0; col < cols.length ; col++) {
            //컬럼의 별명을 문자열로 가져온다.
            colName = cols[col];

            //PreFix가 붙지 않은 형태의 SaveName을 가져온다.
            baseName = colName.substring(sheetPreFix.length);

            frmchild = null;
            try {
                //폼에 있는 해당 이름의 컨트롤을 가져온다.예)"frm_CardNo"
                frmchild = formobj[frmPreFix + baseName];
            } catch (e) {
            }
            //폼에 해당하는 이름의 컨트롤이 없는 경우는 계속 진행한다.
            if (frmchild == null) continue;

            fType = frmchild.type;
            sValue = "";
            //radio의 경우 frmchild가 배열형태가 되므로, frmchild.type으로는 타입을 알수 없다.
            if (typeof fType == "undefined" && frmchild.length > 0) {
                fType = frmchild[0].type;
            }
            sType = sheetobj.getType(row,colName);
            //일부 편집이 불가능한 타입의 컬럼은 건너뛰자.
            if(sType=="Button" || sType == "Link" || sType == "Img") continue;

            //타입별로 값을 설정한다.
            switch (fType) {
                case undefined:
                case "button":
                case "reset":
                case "submit":
                    break;
                case "radio":
                    for (idx = 0; idx < frmchild.length; idx++) {
                        if (frmchild[idx].checked) {
                            sValue = frmchild[idx].value;
                            break;
                        }
                    }
                    break;
                case "checkbox":
                    sValue = (frmchild.checked) ? 1 : 0;
                    break;
                default:
                    let dataMask = frmchild.getAttribute('data-mask') || frmchild.getAttribute('data-dateformat');
                    let temp = frmchild.value;
                    sValue = (dataMask && masks.includes[dataMask]) ? temp.replace(/[^0-9.]/gi, '') : frmchild.value;
            }
            sheetobj.setValue(row, sheetPreFix + baseName, sValue, 0);
        }
        sheetobj.refreshRow(row);

        return true;
    }

    // [Code For vPlus] 5.IBS_CopySheet2Form Start
    /*----------------------------------------------------------------------------
    method : IBS_CopySheet2Form()
    desc : 시트의 한 행을 폼객체에 복사  (ibsheet7 ibsheetinfo.js 마이그레이션)

    param list
    param : json 유형

    param 내부 설정값
    sheet : 값을 입력 받을 ibsheet 객체 (필수)
    form : copy할 폼객체 (필수)
    row : ibsheet 객체의 행 (default : 현재 선택된 행)
    sheetPreFix : 맵핑할 시트의 SavaName 앞에 PreFix 문자 (default : "")
    formPreFix : 맵핑할 폼객체의 이름 혹은 id 앞에  PreFix 문자 (default : "")
    -----------------------------------------------------------------------------*/
    _IBSheet.v7.IBS_CopySheet2Form = function(param) {
        var sheetobj,
        formobj,
        row,
        sheetPreFix,
        frmPreFix,
        cols,
        col,
        rmax,
        colName,
        baseName,
        sheetvalue,
        sheetstring,
        frmchild,
        sType,
        fType,
        sValue;

        if ((!param.sheet) || (typeof param.sheet.version != "function")) {
            _IBSheet.v7.IBS_ShowErrMsg("sheet 인자가 없거나 ibsheet객체가 아닙니다.");
            return false;
        }

        if (param.form == null || typeof param.form != "object" || param.form.tagName != "FORM") {
            _IBSheet.v7.IBS_ShowErrMsg("form 인자가 없거나 FORM 객체가 아닙니다.");
            return false;
        }
        sheetobj = param.sheet;
        formobj = param.form;
        row = param.row == null ? sheetobj.getFocusedRow() : param.row;
        sheetPreFix = param.sheetPreFix == null ? "" : param.sheetPreFix;
        frmPreFix = param.formPreFix == null ? "" : param.formPreFix;

        if (typeof row == "undefined") {
            _IBSheet.v7.IBS_ShowErrMsg("row 인자가 없고, 선택된 행이 존재하지 않습니다.");
            return false;
        }

        //Sheet의 컬럼개수만큼 찾아서 HTML의 Form 각 Control에 값을 설정한다.
        //컬럼개수만큼 루프 실행
        cols = sheetobj.getCols();
        for (col = 0; col < cols.length ; col++) {
            //컬럼의 이름을 가져온다.
            colName = cols[col];

            //PreFix가 붙지 않은 형태의 Name을 가져온다.
            baseName = colName.substring(sheetPreFix.length);

            sheetvalue = sheetobj.getValue(row, colName);

            sValue = "";

            sType = sheetobj.getType(row,colName);

            //일부 편집이 불가능한 타입의 컬럼은 건너뛰자.
            if(sType=="Button" || sType == "Link" || sType == "Img") continue;

            gfnDataBindFormElements($("#"+formobj.id), frmPreFix+baseName, sheetvalue);
        } //end of for(col)

        //정상적인 처리완료
        return true;
    }
    // [Code For vPlus] 5.IBS_CopySheet2Form End

    //ibsheet7 에서 마이그레이션
    /*
     * Form오브젝트 안에 있는 컨트롤을 QueryString으로 구성한다.
     * @param   : form          - form객체 혹은 form객체 id
     * @param   : checkRequired - 선택,필수입력 체크 여부 (boolean(default:true))
     * @param   : encoding      - 문자열 엔코딩 여부 (boolean(default:true))
     * @return  : String        - Form오브젝트 안에 elements을 QueryString으로 구성한 문자열
     *            undefined     - checkRequired인자가 true이고, 필수입력에 걸린경우 return 값
     * @version : 1.0.0.0,
     *
     * @sample1
     *  var sCondParam=FormQueryString(document.frmSearch); //결과:"txtname=이경희&rdoYn=1&sltMoney=원화";
     * @sample2
     *  <input type="text" name="txtName" required="이름">        //필수 입력 항목이면 required="이름" 를 설정한다.
     *  var sCondParam = FormQueryString(document.mainForm, true);//필수입력까지 체크하며, 필수입력에 걸리면 리턴값은 undefined
     *  if (sCondParam==null) return;
     */
    _IBSheet.v7.IBS_FormQueryString = function(form, checkRequired, encoding) {
        if(typeof form == "string") form = document.getElementById(form)||document[form];
        if (typeof form != "object" || form.tagName != "FORM") {
            _IBSheet.v7.IBS_ShowErrMsg("FormQueryString 함수의 인자는 FORM 태그가 아닙니다.");
            return;
        }
        //default setting
        if(typeof checkRequired == "undefined") checkRequired = true;
        if(typeof encoding == "undefined") encoding = true;

        var name = new Array(form.elements.length);
        var value = new Array(form.elements.length);
        var j = 0;
        var plain_text = "";

        //사용가능한 컨트롤을 배열로 생성한다.
        len = form.elements.length;
        for (i = 0; i < len; i++) {
            var prev_j = j;
            switch (form.elements[i].type) {
                case undefined:
                case "button":
                case "reset":
                case "submit":
                    break;
                case "radio":
                case "checkbox":
                    if (form.elements[i].checked == true) {
                        name[j] = _IBSheet.v7.IBS_GetName(form.elements[i]);
                        value[j] = form.elements[i].value;
                        j++;
                    }
                    break;
                case "select-one":
                    name[j] = _IBSheet.v7.IBS_GetName(form.elements[i]);
                    var ind = form.elements[i].selectedIndex;
                    if (ind >= 0) {

                        value[j] = form.elements[i].options[ind].value;

                    } else {
                        value[j] = "";
                    }
                    j++;
                    break;
                case "select-multiple":
                    name[j] = _IBSheet.v7.IBS_GetName(form.elements[i]);
                    var llen = form.elements[i].length;
                    var increased = 0;
                    for (k = 0; k < llen; k++) {
                        if (form.elements[i].options[k].selected) {
                            name[j] = _IBSheet.v7.IBS_GetName(form.elements[i]);
                            value[j] = form.elements[i].options[k].value;
                            j++;
                            increased++;
                        }
                    }
                    if (increased > 0) {
                        j--;
                    } else {
                        value[j] = "";
                    }
                    j++;
                    break;
                default:
                    name[j] = _IBSheet.v7.IBS_GetName(form.elements[i]);
                    value[j] = form.elements[i].value;
                    j++;
            }

            if (checkRequired) {
                //html 컨트롤 태그에 required속성을 설정하면 필수입력을 확인할 수 있다.
                //<input type="text" name="txtName" required="이름">
                if (_IBSheet.v7.IBS_RequiredChk(form.elements[i]) && prev_j != j && value[prev_j] == "") {
                    if (form.elements[i].getAttribute("required") == null ||
                        form.elements[i].getAttribute("required") == ""
                    ) {
                        alert('"' + _IBSheet.v7.IBS_GetLabel(form.elements[i]) + '" 은 필수 입력 항목 입니다.' );
                    } else {
                        alert('"' + form.elements[i].getAttribute("required") + '" 은 필수 입력 항목 입니다.');
                    }
                    //컨트롤이 숨겨져 있을수도 있으므로 에러 감싼다.
                    try {
                        form.elements[i].focus();
                    } catch (ee) {
                    }
                    return;
                }
            }
        }
        //QueryString을 조합한다.
        for (i = 0; i < j; i++) {
            if (name[i] != ''){
                if(encoding){
                    plain_text += encodeURIComponent(name[i]) + "=" + encodeURIComponent(value[i]) + "&";
                }else{
                    plain_text += name[i] + "=" + value[i] + "&";
                }
            }
        }
        //마지막에 &를 없애기 위함
        if (plain_text != "") plain_text = plain_text.substr(0, plain_text.length - 1);

        return plain_text;
    }
    //ibsheet7 에서 마이그레이션
    /*
     * Form오브젝트 안에 있는 컨트롤을 Json Object으로 구성한다.
     * @param   : form          - form객체 혹은 form객체 id
     * @param   : checkRequired - 선택,필수입력 체크 여부 (boolean(default:true))
     * @param   : encoding      - 문자열 엔코딩 여부 (boolean(default:true))
     * @return  : String        - Form오브젝트 안에 elements을 QueryString으로 구성한 문자열
     *            undefined     - checkRequired인자가 true이고, 필수입력에 걸린경우 return 값
     * @version : 1.0.0.0,
     *
     * @sample1
     *  var sCondParam=FormToJson(document.frmSearch); //결과: {txtname:"이경희" , "rdoYn":"on","sltMoney":"원화"};
     * @sample2
     *  <input type="text" name="txtName" required="이름">        //필수 입력 항목이면 required="이름" 를 설정한다.
     *  var sCondParam = FormToJson(document.mainForm, true);//필수입력까지 체크하며, 필수입력에 걸리면 리턴값은 undefined
     *  if (sCondParam==null) return;
     */
    _IBSheet.v7.IBS_FormToJson = function(form, checkRequired, encoding) {
        if(typeof form == "string") form = document.getElementById(form)||document[form];
        if (typeof form != "object" || form.tagName != "FORM") {
            IBS_ShowErrMsg("FormToJson 함수의 인자는 FORM 태그가 아닙니다.");
            return;
        }
        //default setting
        if(typeof checkRequired == "undefined") checkRequired = true;
        if(typeof encoding == "undefined") encoding = true;

        var name = new Array(form.elements.length);
        var value = new Array(form.elements.length);
        var j = 0;
        var plain_obj = {};

        //사용가능한 컨트롤을 배열로 생성한다.
        len = form.elements.length;
        for (i = 0; i < len; i++) {
            var prev_j = j;
            switch (form.elements[i].type) {
                case undefined:
                case "button":
                case "reset":
                case "submit":
                    break;
                case "radio":
                case "checkbox":
                    if (form.elements[i].checked == true) {
                        name[j] = _IBSheet.v7.IBS_GetName(form.elements[i]);
                        value[j] = form.elements[i].value;
                        j++;
                    }
                    break;
                case "select-one":
                    name[j] = _IBSheet.v7.IBS_GetName(form.elements[i]);
                    var ind = form.elements[i].selectedIndex;
                    if (ind >= 0) {
                        value[j] = form.elements[i].options[ind].value;
                    } else {
                        value[j] = "";
                    }
                    j++;
                    break;
                case "select-multiple":
                    name[j] = _IBSheet.v7.IBS_GetName(form.elements[i]);
                    var llen = form.elements[i].length;
                    var increased = 0;
                    for (k = 0; k < llen; k++) {
                        if (form.elements[i].options[k].selected) {
                            name[j] = _IBSheet.v7.IBS_GetName(form.elements[i]);
                            value[j] = form.elements[i].options[k].value;
                            j++;
                            increased++;
                        }
                    }
                    if (increased > 0) {
                        j--;
                    } else {
                        value[j] = "";
                    }
                    j++;
                    break;
                default:
                    name[j] = _IBSheet.v7.IBS_GetName(form.elements[i]);
                    value[j] = form.elements[i].value;
                    j++;
            }

            if (checkRequired) {
                //html 컨트롤 태그에 required속성을 설정하면 필수입력을 확인할 수 있다.
                //<input type="text" name="txtName" required="이름">
                if (_IBSheet.v7.IBS_RequiredChk(form.elements[i]) && prev_j != j && value[prev_j] == "") {
                    if (form.elements[i].getAttribute("required") == null ||
                        form.elements[i].getAttribute("required") == ""
                    ) {
                        alert('"' + _IBSheet.v7.IBS_GetLabel(form.elements[i]) + '" 은 필수 입력 항목 입니다.' );
                    } else {
                        alert('"' + form.elements[i].getAttribute("required") + '" 은 필수 입력 항목 입니다.');
                    }
                    //컨트롤이 숨겨져 있을수도 있으므로 에러 감싼다.
                    try {
                        form.elements[i].focus();
                    } catch (ee) {
                    }
                    return;
                }
            }
        }
        //JSON을 조합한다.
        var tname = "";
        var tvalue = "";
        for (i = 0; i < j; i++) {
            if(encoding){
                tname = encodeURIComponent(name[i]);
                tvalue = encodeURIComponent(value[i])
            }else{
                tname = name[i];
                tvalue = value[i];
            }
            if (name[i] != ''){
                //이미 있다면 배열로 변경
                if(plain_obj[tname]){
                    //이미 배열인 경우
                    if( Array.isArray(plain_obj[tname]) ){
                        plain_obj[tname].push(tvalue);
                    }else{
                        plain_obj[tname] = [plain_obj[tname] , tvalue ];
                    }
                }else{
                    plain_obj[tname] = tvalue;
                }
            }
        }
        return plain_obj;
    }
    /*
     * FromToCalendar 사용시 사용 함수
     * @param   : id          - from혹은 to 날짜가 표시될 input 객체
     * @param   : format      - 날짜 형태 YMD
     * @version : 1.0.0.0,
     *
     * @sample1
     *  <span>
     *  <input type='text' name="fromID" id="fromID" DATE='FromYMD' DATE_REF="toID"/>
     *  <button class='calbtn' onclick='IBSheet.v7.IBS_FromToCalendar("fromID","yyyy-MM-dd")'>달력</button>
     *  ~ <input type='text' name="toID" id="toID" DATE='ToYMD' DATE_REF="fromID"/>
     *  <button class='calbtn' onclick='IBSheet.v7.IBS_FromToCalendar("toID","yyyy-MM-dd")'>달력</button>
     *  </span>
     */
    _IBSheet.v7.IBS_FromToCalendar = function(id,format) {
        if(event!=null){
            event.preventDefault();
        }
        var ele = document.getElementById(id);
        var isFrom = ele.getAttribute("DATE")=="FromYMD";
        var oppoID = ele.getAttribute("DATE_REF");
        var oppoValue = document.getElementById(oppoID).value;
        var oppoValueTimeStamp = oppoValue!=""?IBSheet.stringToDate(oppoValue,format):null;
        var opt = {
                Format:format,
                RowsPrev:2,
                RowsNext:2,
                Buttons:6,
                Texts:{Ok:"닫기",Clear:"지우기"},
                OnCanEditDate:function(d){
                  if(oppoValue!=""){
                      if(isFrom){
                          if(d>oppoValueTimeStamp) return false;
                      }else{
                          if(d<oppoValueTimeStamp) return false;
                      }
                  }
                },
                OnGetCalendarDate:function(d,dt,cls,r){
                    var targetValue = document.getElementById(id).value;
                    if(oppoValue=="" || targetValue =="") return;
                    var targetValueTimeStamp = IBSheet.stringToDate(targetValue,format);
                    if(isFrom){
                        if(d>=targetValueTimeStamp && d<=oppoValueTimeStamp)  return "<span style='color:orange'>"+dt+"</span>";
                    }else{
                        if(d<=targetValueTimeStamp && d>=oppoValueTimeStamp)  return "<span style='color:orange'>"+dt+"</span>";
                    }
                },
                OnButtonClick:function(evt){
                    if(evt==2){ //지우기
                        $("#"+id).val("");
                    }
                    fromtoCal.Close();
                }
        };
        //달력에서 일자 선택시 callback(반대편 달력을 띄운다.)
        function calPickCallBack(v){
            $("#"+id).val(IBSheet.dateToString(parseInt(v), format) );
            var _ele = document.getElementById(id);
            var _oppoID = _ele.getAttribute("DATE_REF");
            var _oppoValue = document.getElementById(_oppoID).value;
            if(_oppoValue==""){
                if(event!=null){
                    event.preventDefault();
                }
                _IBSheet.v7.IBS_FromToCalendar(_oppoID,format);
            }
        }
        var fromtoCal = IBSheet.showCalendar(opt,{Tag:id},calPickCallBack.bind(id));
    }
    //ibsheet7 에서 마이그레이션
    //시트의 각 컬럼 Name을 구분자 "|"연결한 string으로 리턴
    //param : ibsheet 객체
    _IBSheet.v7.IBS_ConcatSaveName = function(sheet) {
        let rtnCols = sheet.getUserOptions(2).Cols;
        let lCols = sheet.getUserOptions(2).LeftCols;
        let rCols = sheet.getUserOptions(2).RightCols;

        if (!vChk.isEmpty(lCols)) { rtnCols = rtnCols.concat(lCols) }
        if (!vChk.isEmpty(rCols)) { rtnCols = rtnCols.concat(rCols) }

        return rtnCols.map(c => c.Name).filter(name => name != '_ConstWidth').join('|');
    }

    /**
     * 에러메시지를 표시한다. IBS_ShowErrMsg 대신 이 함수를 사용해야 한다.
     * @param   : sMsg      - 메시지
     * @return  : 없음
     * @version : 3.4.0.50
     * @sample
     *  IBS_ShowErrMsg("에러가 발생했습니다.");
     */
    _IBSheet.v7.IBS_ShowErrMsg = function(sMsg) {
        return alert("[ibsheet-common]\n" + sMsg);
    }

    //required 여부 확인
    _IBSheet.v7.IBS_RequiredChk = function(obj) {
        return (obj.getAttribute("required") != null);
    }
    //객체의 id 혹은 name을 리턴
    _IBSheet.v7.IBS_GetName = function(obj) {
        if (obj.name != "") {
            return obj.name;
        } else if (obj.id != "") {
            return obj.id;
        } else {
            return "";
        }
    }

    //객체의 label 혹은 id 혹은 name을 리턴
    _IBSheet.v7.IBS_GetLabel = function(obj){
        if(obj.labels && obj.labels.length>0){
            return obj.labels[0].textContent;
        }else{
            return IBS_GetName(obj);
        }
    }
}(window, document));
