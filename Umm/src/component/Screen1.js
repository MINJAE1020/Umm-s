import React, { useState, useEffect } from "react";

// Sample data for regions, districts, and neighborhoods
const data = {
    서울특별시: {
        용산구: [
            "후암동",
            "용산2가동",
            "남영동",
            "원효로1동",
            "원효로2동",
            "효창동",
            "용문동",
            "한강로동",
            "이촌1동",
            "이촌2동",
            "이태원1동",
            "이태원2동",
            "한남동",
            "서빙고동",
            "보광동",
            "동자동",
        ],
        서초구: [
            "서초1동",
            "서초2동",
            "서초3동",
            "서초4동",
            "잠원동",
            "반포본동",
            "반포1동",
            "반포2동",
            "반포3동",
            "반포4동",
            "방배본동",
            "방배1동",
            "방배2동",
            "방배3동",
            "방배4동",
            "양재1동",
            "양재2동",
            "내곡동",
        ],
        동작구: [
            "노량진1동",
            "노량진2동",
            "상도1동",
            "상도2동",
            "상도3동",
            "상도4동",
            "흑석동",
            "사당1동",
            "사당2동",
            "사당3동",
            "사당4동",
            "사당5동",
            "대방동",
            "신대방1동",
            "신대방2동",
        ],
        송파구: [
            "잠실본동",
            "잠실2동",
            "잠실3동",
            "잠실4동",
            "잠실6동",
            "잠실7동",
            "풍납1동",
            "풍납2동",
            "송파1동",
            "송파2동",
            "석촌동",
            "삼전동",
            "가락본동",
            "가락1동",
            "가락2동",
            "문정1동",
            "문정2동",
            "장지동",
            "방이1동",
            "방이2동",
            "오륜동",
            "오금동",
            "거여1동",
            "거여2동",
            "마천1동",
            "마천2동",
        ],
        강동구: [
            "강일동",
            "상일동",
            "명일제1동",
            "명일제2동",
            "고덕제1동",
            "고덕제2동",
            "암사제1동",
            "암사제2동",
            "암사제3동",
            "천호제1동",
            "천호제2동",
            "천호제3동",
            "성내제1동",
            "성내제2동",
            "성내제3동",
            "길동",
            "둔촌제1동",
            "둔촌제2동",
        ],
        광진구: [
            "화양동",
            "군자동",
            "중곡제1동",
            "중곡제2동",
            "중곡제3동",
            "중곡제4동",
            "자양제1동",
            "자양제2동",
            "자양제3동",
            "구의제1동",
            "구의제2동",
            "구의제3동",
        ],
        중랑구: [
            "면목제1동",
            "면목제2동",
            "면목제3.8동",
            "면목제4동",
            "면목제5동",
            "면목본동",
            "면목제7동",
            "면목제9동",
            "망우본동",
            "망우제3동",
            "망우제4동",
            "신내1동",
            "신내2동",
        ],
        노원구: [
            "월계1동",
            "월계2동",
            "월계3동",
            "공릉1동",
            "공릉2동",
            "하계1동",
            "하계2동",
            "중계본동",
            "중계1동",
            "중계4동",
            "중계2.3동",
            "상계1동",
            "상계2동",
            "상계3.4동",
            "상계5동",
            "상계6.7동",
            "상계8동",
            "상계9동",
            "상계10동",
        ],
        도봉구: [
            "창제1동",
            "창제2동",
            "창제3동",
            "창제4동",
            "창제5동",
            "도봉제1동",
            "도봉제2동",
            "쌍문제1동",
            "쌍문제2동",
            "쌍문제3동",
            "쌍문제4동",
            "방학제1동",
            "방학제2동",
        ],
        강북구: [
            "번1동",
            "번2동",
            "번3동",
            "수유1동",
            "수유2동",
            "수유3동",
            "삼각산동",
            "미아동",
            "송중동",
            "송천동",
            "삼양동",
            "미아동",
        ],
        성북구: [
            "성북동",
            "삼선동",
            "동선동",
            "돈암제1동",
            "돈암제2동",
            "안암동",
            "보문동",
            "정릉제1동",
            "정릉제2동",
            "정릉제3동",
            "정릉제4동",
            "길음제1동",
            "길음제2동",
            "월곡제1동",
            "월곡제2동",
            "장위제1동",
            "장위제2동",
            "장위제3동",
            "석관동",
        ],
        동대문구: [
            "용신동",
            "제기동",
            "전농제1동",
            "전농제2동",
            "답십리제1동",
            "답십리제2동",
            "답십리제3동",
            "답십리제4동",
            "장안제1동",
            "장안제2동",
            "청량리동",
            "회기동",
            "휘경제1동",
            "휘경제2동",
            "이문제1동",
            "이문제2동",
        ],
        성동구: [
            "왕십리도선동",
            "왕십리2동",
            "마장동",
            "사근동",
            "행당제1동",
            "행당제2동",
            "응봉동",
            "금호1가동",
            "금호4가동",
            "성수1가제1동",
            "성수1가제2동",
            "성수2가제1동",
            "성수2가제3동",
            "송정동",
            "용답동",
        ],
        중구: [
            "소공동",
            "회현동",
            "명동",
            "필동",
            "장충동",
            "광희동",
            "을지로동",
            "신당동",
            "다산동",
            "약수동",
            "청구동",
            "신당제5동",
            "동화동",
            "황학동",
            "중림동",
        ],
        종로구: [
            "청운효자동",
            "사직동",
            "삼청동",
            "부암동",
            "평창동",
            "무악동",
            "교남동",
            "가회동",
            "종로1.2.3.4가동",
            "종로5.6가동",
            "이화동",
            "창신제1동",
            "창신제2동",
            "창신제3동",
            "숭인제1동",
            "숭인제2동",
        ],
        서대문구: [
            "천연동",
            "북아현동",
            "충현동",
            "신촌동",
            "연희동",
            "홍제제1동",
            "홍제제3동",
            "홍제제2동",
            "홍은제1동",
            "홍은제2동",
            "남가좌제1동",
            "남가좌제2동",
            "북가좌제1동",
            "북가좌제2동",
            "영천동",
            "대현동",
            "대신동",
            "신창동",
        ],
        은평구: [
            "녹번동",
            "불광제1동",
            "불광제2동",
            "갈현제1동",
            "갈현제2동",
            "구산동",
            "대조동",
            "응암제1동",
            "응암제2동",
            "응암제3동",
            "신사제1동",
            "신사제2동",
            "증산동",
            "진관동",
        ],
        마포구: [
            "도화동",
            "용강동",
            "대흥동",
            "염리동",
            "신수동",
            "서강동",
            "서교동",
            "합정동",
            "망원제1동",
            "망원제2동",
            "연남동",
            "성산제1동",
            "성산제2동",
            "상암동",
        ],
        강서구: [
            "염창동",
            "등촌제1동",
            "등촌제2동",
            "등촌제3동",
            "화곡제1동",
            "화곡제2동",
            "화곡제3동",
            "화곡제4동",
            "화곡본동",
            "화곡제6동",
            "화곡제8동",
            "가양제1동",
            "가양제2동",
            "가양제3동",
            "발산제1동",
            "우장산동",
            "공항동",
            "방화제1동",
            "방화제2동",
        ],
        양천구: [
            "목1동",
            "목2동",
            "목3동",
            "목4동",
            "목5동",
            "신월1동",
            "신월2동",
            "신월3동",
            "신월4동",
            "신월5동",
            "신월6동",
            "신월7동",
            "신정1동",
            "신정2동",
            "신정3동",
            "신정4동",
            "신정6동",
            "신정7동",
        ],
        영등포구: [
            "여의동",
            "당산제1동",
            "당산제2동",
            "양평제1동",
            "양평제2동",
            "신길제1동",
            "신길제3동",
            "신길제4동",
            "신길제5동",
            "신길제6동",
            "신길제7동",
            "대림제1동",
            "대림제2동",
            "대림제3동",
            "영등포본동",
            "영등포동",
        ],
        구로구: [
            "신도림동",
            "구로제1동",
            "구로제2동",
            "구로제3동",
            "구로제4동",
            "구로제5동",
            "고척제1동",
            "고척제2동",
            "개봉제1동",
            "개봉제2동",
            "개봉제3동",
            "오류제1동",
            "오류제2동",
            "수궁동",
            "가리봉동",
        ],
        금천구: [
            "가산동",
            "독산제1동",
            "독산제2동",
            "독산제3동",
            "독산제4동",
            "시흥제1동",
            "시흥제2동",
            "시흥제3동",
            "시흥제4동",
            "시흥제5동",
        ],
        관악구: [
            "보라매동",
            "청림동",
            "성현동",
            "행운동",
            "낙성대동",
            "청룡동",
            "은천동",
            "중앙동",
            "인헌동",
            "난향동",
            "조원동",
            "대학동",
            "삼성동",
            "미성동",
            "난곡동",
            "신림동",
            "신사동",
            "신원동",
        ],
        강남구: [
            "개포동",
            "일원본동",
            "일원1동",
            "일원2동",
            "수서동",
            "세곡동",
            "압구정동",
            "청담동",
            "대치1동",
            "대치2동",
            "대치4동",
            "역삼1동",
            "역삼2동",
            "도곡1동",
            "도곡2동",
            "개포1동",
            "개포4동",
            "세곡동",
        ],
    },
    대구광역시: {
        중구: [
            "동인동",
            "삼덕동",
            "성내1동",
            "성내2동",
            "성내3동",
            "대신동",
            "남산1동/명덕초방향(서편)",
            "남산1동/경북여고방향(동편)",
            "남산2동",
            "남산3동",
            "남산4동",
            "대봉1동",
            "대봉2동",
        ],
        동구: [
            "신천1,2동",
            "신천3동",
            "신천4동",
            "신암1동",
            "신암2동",
            "신암3동",
            "신암4동",
            "신암5동",
            "혁신동",
            "안심1동",
            "안심2동",
            "안심3동",
            "안심4동",
            "해안동",
            "공산동",
            "방촌동",
            "동촌동",
            "지저동",
            "불로봉무동",
            "도평동",
            "효목1동",
            "효목2동",
        ],
        서구: [
            "평리1동",
            "비산7동",
            "비산6동",
            "비산5동",
            "원대동",
            "이현동",
            "상리동",
            "중리동",
            "평리6동",
            "평리5동",
            "평리4동",
            "평리3동",
            "평리2동",
            "비산4동",
            "비산2.3동",
            "비산1동",
            "내당4동",
            "내당2.3동",
            "내당1동",
        ],
        남구: [],
        북구: [
            "산격1동~4동+(구)대현1동+복현1동+복현2동+검단동+관문동(매천택지)",
            "고성동+칠성동+침산2동+침산3동",
            "태전1동+태전2동+관음동+읍내동+동천동+국우동+관문동(매천)",
            "노원동+침산1동+(구)대현2동+무태조야동+관문동(매천제외)+구암동+태전2동(매천택지구역)",
            "고성동+칠성동+침산1동~3동+노원동+무태조야동(공동주택)",
            "산격2동+산격3동+복현2동+검단동+무태조야동(단독주택)+구암동",
            "산격1동+관문동+태전1동+태전2동+학정동+국우동+관음동(관음중앙로 서편)",
            "산격4동+복현1동+대현동+읍내동+동천동+관음동(관음중앙로 동편)",
            "고성동+칠성동+침산1동~3동+노원동+산격1동+관문동+태전1동+태전2동+국우동+관음동(관음중앙로 서편)",
            "산격2동+산격3동+산격4동+복현1동+복현2동+대현동+검단동+구암동+읍내동+동천동+관음동(관음중앙로 동편)+무태조야동(단독주택)",
        ],
        수성구: [],
        달서구: [
            "성당동+두류동+본리동+감삼동+송현동+본동",
            "죽전동+장기동+용산동+이곡동+신당동+월성동+진천동+유천동+상인동+도원동",
            "신당동+용산동+이곡동+월성2동 공동주택지역",
            "죽전동+장기동+감삼동+본리동+본동+두류동+성당동+송현동+월성1동 일부 공동주택지역",
            "상인동+월성1동+진천동+유천동+도원동 공동주택지역",
        ],
        달성군: [
            "달성2차산업단지",
            "내리+대암리+목단리+유산리",
            "오설리+도동리",
            "화산리+수리+징리",
            "고봉리+예현리+평촌리+가천리(월+금)",
            "창리(면소재지)+응암리(청아람)",
            "면소재지+하산1+2리+동곡2리",
            "대일2리(화요일)+주2리(수요일)+옥분리(단양마을 목요일)+단산리+상원리+행정1리+냉천2리(월+목요일)+행정2리(금요일) *조정가능",
            "냉천1리+대일1리+주1리+옥분리+삼산리+우록1리+오리+정대리",
            "용계리(단독주택)",
            "용계리(공동주택)",
            "지리+대리+신기리",
            "자모리+오산리",
            "원교4리",
            "성하1+2+4리",
            "중5~12리",
            "상리+중1~4리+하리+부리+성하3리+원교1~3리",
            "옥포지구(이진캐스빌)",
            "옥포지구(천년나무2+3단지)",
            "옥포지구(대성베르힐)",
            "김흥리",
            "반송리",
            "강림1.2리",
            "본리리",
            "기세리",
            "간경리",
            "신당리+교항리",
            "금리",
            "유곡리+도의리+가태리+한정리+본말리",
            "음리+양리+용리+초곡리+봉리(테크노폴리스)+쌍계리+상리",
            "세천리",
            "서재리",
            "이천리+달천리+박곡리",
            "부곡리",
            "매곡리",
            "죽곡리",
            "남2리+남3리+북2리+북6리+북7리",
            "남2리+북2리+공장지역",
            "북6리+북7리",
            "남2리+남3리+북2리",
            "남1리+북1+6+7리",
            "본리리(달성1차공단)",
            "상리",
            "하리",
            "노이리(노홍저수지 아래)",
            "마비정",
            "홈실",
            "본리리(마비정제외)",
            "명곡리(홈실제외)",
            "무등1+대평리+기곡리+현내리+감문리+육신사+묘리+하산1리+수무지+봉촌1리+동곡1리+동곡2리 삼태동",
            "무등2리+ 대평+ 기곡+ 현내리+ 너울터+ 제일골+ 봉촌2리+ 하산(중간길)낙동방향+ 동곡리+ 감문리",
        ],
    },
    부산: {
        해운대구: ["우동", "중동", "송정동"],
    },
    인천: {},
    광주: {},
    대전: {},
    울산: {},
    구미: {},
};

const disposeContent = {
    display: "flex",
    width: "100%",
    height: "100%",
    border: "1px solid black",
};

const resultContent = {
    width: "50%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
};

const resultDispose = {
    border: "1px solid black",
    width: "100%",
    height: "70%",
    padding: "1%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
};

const department = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const dpstyle = {
    fontWeight: "bold",
    backgroundColor: "gray",
    color: "white",
    padding: "5px",
};

const imgIcon = {
    height: "40px",
    width: "40px",
};

const userSelectContainer = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    justifyContent: "space-between",
};

const labelStyle = {
    marginBottom: "10px",
    marginRight: "10px",
    width: "70%",
};

const selectStyle = {
    width: "100%",
    padding: "5px",
    borderRadius: "3px",
    border: "1px solid #ccc",
};

const buttonStyle = {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
};

// export default Showdispose;
function Screen1() {
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedNeighborhood, setSelectedNeighborhood] = useState(""); // 추가
    const [districts, setDistricts] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (selectedRegion) {
            setDistricts(Object.keys(data[selectedRegion]));
            setSelectedDistrict(""); // Reset district and neighborhood when region changes
            setNeighborhoods([]);
            setSelectedNeighborhood(""); // 추가
        }
    }, [selectedRegion]);

    useEffect(() => {
        if (selectedDistrict) {
            setNeighborhoods(data[selectedRegion][selectedDistrict]);
            setSelectedNeighborhood(""); // 추가
        }
    }, [selectedDistrict]);

    const handleSearch = async () => {
        if (selectedRegion && selectedDistrict && selectedNeighborhood) {
            console.log("Sending request with:", {
                region: selectedRegion,
                district: selectedDistrict,
                dong: selectedNeighborhood,
            });

            const response = await fetch("http://localhost:3000/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    region: selectedRegion,
                    district: selectedDistrict,
                    dong: selectedNeighborhood,
                }),
            });
            const responseData = await response.json(); // 서버 응답을 JSON으로 파싱
            if (responseData === "Data not found") {
                setResult(null);
            } else {
                setResult(responseData); // 파싱한 응답을 상태 변수에 저장
            }
        } else {
            alert("지역, 구, 동을 선택해주세요.");
        }
    };

    return (
        <div className="screen">
            <div className="dispose-content" style={disposeContent}>
                <div
                    className="user-select-content"
                    style={userSelectContainer}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "80%",
                        }}
                    >
                        <label style={labelStyle}>
                            지역:
                            <select
                                style={selectStyle}
                                value={selectedRegion}
                                onChange={(e) =>
                                    setSelectedRegion(e.target.value)
                                }
                            >
                                <option value="">선택하세요</option>
                                {Object.keys(data).map((region) => (
                                    <option key={region} value={region}>
                                        {region}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label style={labelStyle}>
                            구:
                            <select
                                style={selectStyle}
                                value={selectedDistrict}
                                onChange={(e) =>
                                    setSelectedDistrict(e.target.value)
                                }
                                disabled={!selectedRegion}
                            >
                                <option value="">선택하세요</option>
                                {districts.map((district) => (
                                    <option key={district} value={district}>
                                        {district}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label style={labelStyle}>
                            동:
                            <select
                                style={selectStyle}
                                value={selectedNeighborhood}
                                onChange={(e) =>
                                    setSelectedNeighborhood(e.target.value)
                                }
                                disabled={!selectedDistrict}
                            >
                                <option value="">선택하세요</option>
                                {neighborhoods.map((neighborhood) => (
                                    <option
                                        key={neighborhood}
                                        value={neighborhood}
                                    >
                                        {neighborhood}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <button style={buttonStyle} onClick={handleSearch}>
                        조회
                    </button>
                </div>

                <div className="result" style={resultContent}>
                    {result ? (
                        <div style={resultDispose}>
                            <label>
                                배출 요일:<p>{result.disposalDay}</p>
                            </label>
                            <label>
                                미수거일:<p>{result.nonCollectionDay}</p>
                            </label>
                            <label>
                                배출 장소:<p>{result.disposalLocation}</p>
                            </label>
                            <label>
                                배출 방법:<p>{result.disposalMethod}</p>
                            </label>
                            <label>
                                배출 시간:<p>{result.disposalTime}</p>
                            </label>
                        </div>
                    ) : (
                        <div style={resultDispose}>
                            <label>
                                배출 요일:<p></p>
                            </label>
                            <label>
                                미수거일:<p></p>
                            </label>
                            <label>
                                배출 장소:<p></p>
                            </label>
                            <label>
                                배출 방법:<p></p>
                            </label>
                            <label>
                                배출 시간:<p></p>
                            </label>
                        </div>
                    )}

                    <div style={department}>
                        <img style={imgIcon} src="" alt="icon" />
                        <p style={dpstyle}>
                            {result ? result.departmentName : "환경청소과"}
                        </p>
                        <img style={imgIcon} src="" alt="icon" />
                        <p style={dpstyle}>
                            {result ? result.departmentPhone : "032-xx-xxx"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Screen1;
