import React from 'react'
import {Card,CardContent,Typography} from '@material-ui/core'
import './InfoBox.css'

function InfoBox({ title, isRed, isGrey,cases, total, active, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && 'infoBox--selected'} ${
        isRed && 'infoBox--red'
      } ${isGrey && 'infoBox--grey'}`}
    >
      <CardContent>
        <Typography className='InfoBox__title' color='textSecondary'>
          {title}
        </Typography>
        <h2 className='InfoBox__cases'>{cases}</h2>
        <Typography className='InfoBox__total' color='textSecondary'>
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  )
}

export default InfoBox
