import React, { useState, useEffect } from 'react'
import { MenuItem, Select, FormControl } from '@material-ui/core'
import axios from 'axios'

import './App.css'
import { Card, CardContent } from '@material-ui/core'
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import LineGraph from './LineGraph'
import { sortData, prettyPrintStat } from './util'
import "leaflet/dist/leaflet.css"

function App() {
  let [countries, setCountries] = useState([])
  const [country, setCountry] = useState('WorldWide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData,setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat:34.8076,lng:-404796})
  const [mapZoom,setMapZoom] = useState(3)
  const [mapCountries,setMapCountries] = useState([])
  const [casesType,setCasesType] = useState("cases")


  //below are the two ways for fething api in use Effect

  useEffect (()=>{
  async function fetchMyAPI() {
  const {data} = await axios.get('https://disease.sh/v3/covid-19/all')
  setCountryInfo(data)
  }
  fetchMyAPI()
  },[])

  // useEffect(() => {
    // fetch('https://disease.sh/v3/covid-19/all')
      // .then((response) => response.json())
      // .then((data) => {
        // setCountryInfo(data)
      // })
  // }, [])

//we cant fetch api in useEffect .To do that we have to use another function inside useEffect to fetch the api

//if retrun countries from getCountriesData and catch that value in useEffect below it is not working???
  useEffect(() => {
    getCountriesData()
  }, [])
  const getCountriesData = async () => {
    const { data } = await axios.get('https://disease.sh/v3/covid-19/countries')
    const countries = data.map((country) => ({
      name: country.country,
      value: country.countryInfo.iso2,
    }))
    setMapCountries(data)
    const sortedData = sortData(data)
    setTableData(sortedData)
    setCountries(countries)

  }
  const handleCountryChange = async ({ target: { value } }) => {
    setCountry(value)
    const url =
      value === 'WorldWide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${value}`

    let { data } = await axios.get(url)
    setCountryInfo(data)
    setMapCenter([data.countryInfo.lat,data.countryInfo.long])
    setMapZoom(4)
  }

  return (
    <div className='App'>
      <div className='app__left'>
        <div className='app__header'>
          <h1>COVID-19 TRACKER</h1>
          <FormControl className='app__dropdown'>
            <Select
              variant='outlined'
              onChange={handleCountryChange}
              value={country}
            >
              <MenuItem value='WorldWide'>WorldWide</MenuItem>
              {countries.map((country) => {
                return (
                  <MenuItem key={country.name} value={country.value}>
                    {country.name}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </div>
        <div className='app__stats'>
          {/* 3infoboxes */}
          <InfoBox
            isRed
            active={casesType === 'cases'}
            className='infoBox__cases'
            onClick={(e) => setCasesType('cases')}
            title='Coronavirus Cases'
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          ></InfoBox>
          <InfoBox
            active={casesType === 'recovered'}
            className='infoBox__recovered'
            onClick={(e) => setCasesType('recovered')}
            title='Recovered'
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          ></InfoBox>
          <InfoBox
            isGrey
            active={casesType === 'deaths'}
            className='infoBox__deaths'
            onClick={(e) => setCasesType('deaths')}
            title='Deaths'
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          ></InfoBox>
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          <h3>worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  )
}

export default App
