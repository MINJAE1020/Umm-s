import React from 'react';
import imgTrash from '../img/trashbag.png'
const screen ={
  display: 'flex',
  justifyContent: 'space-between',
};

const mapContainer ={
  width: '50%',
  border: '1px solid black',
  display: 'flex',
  flexDirection:'column',
};

const locateContent ={
  display: 'flex',
  flexDirection:'row',
  alignItems: 'center',
  margin: '2%',
};

const locateBar ={
  border: '1px solid black',
  borderRadius: '5px',
  width: '80%',
  boxSizing: 'content-box',
  margin: '2%',
};

const mapContent ={
  width:'90%',
  height:'90%',
  border: '5px solid rgb(30, 187, 72)',
  margin: '2%',
  borderRadius: '5px',
};

// -----------------------------------------

const dataContainer ={
  width: '45%',
  border: '1px solid black',
};

const barList ={
  listStyleType: 'none',
  padding: '0',
  display: 'flex',
  justifyContent: 'center'
};

const barItem={
  marginBottom: '10px',
  backgroundColor: 'rgb(30, 187, 72)',
  width: '70%',
  height: '3rem',
  borderRadius: '5px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};


const select = {
  width: '30%',
  marginBottom: '10px',
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  backgroundColor: '#fff',
  margin: '2%',
};

const imgicon ={
  height: '40px',
  width: '40px'
};

const pstyle={
  fontWeight: 'bold',
  marginLeft: '5%',
  marginRight: '5%'
};
function Screen2() {
  return (
    <div className="screen" style={screen}>
      <div className="map-container" style={mapContainer}>
        <div>
          <label style={locateContent}>내위치: <div style={locateBar}><p>인천광역시 서구 검단동</p></div></label>
        </div>
        <div style={mapContent}></div>
      </div>
      
      {/* Right section with data from Excel */}
      <div className="data-container" style={dataContainer}>
        {/* Select element for choosing the type of list */}
        <select style={select}>
          <option value="type1">수거 용기</option>
          <option value="type2">전용 봉투</option>
          {/* Add more options as needed */}
        </select>
        
        {/* List of bar-shaped data */}
        <ul className="bar-list" style={barList}>
          {/* Each list item represents a bar-shaped data */}
          <li className="bar-item" style={barItem}>
            <img style={imgicon} src={imgTrash}></img>
            <p style={pstyle}>전용봉투</p>
            <p style={pstyle}>2L</p>
            <p style={pstyle}>400</p>
          </li>
          {/* Add more list items as needed */}
        </ul>
      </div>
    </div>
  );
}

export default Screen2;