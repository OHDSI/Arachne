import { checkDatabaseById } from "../../../api/data-sources"

import { Grid } from "../Grid"

import { Icon } from "../Icon/Icon"
import { Button } from "../Button/Button"

import { useState } from "react"
import { Status } from "../../../libs/enums"
import { Spinner } from "../Spinner"

export const CheckDatabase: React.FC<any> = (props) => {
  const {value} = props;
  const [status, setStatus] = useState(Status.INITIAL);
  const checkDataSource = async () => {
    setStatus(Status.IN_PROGRESS)
    try {
      const res = await checkDatabaseById(value)
      setStatus(res ? Status.SUCCESS : Status.ERROR)
    }  catch(e) {

    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case Status.INITIAL:
      case Status.IN_PROGRESS: 
        return "info"
      case Status.SUCCESS:
        return "success"
      case Status.ERROR:
        return "error"
    }

  }

  const getIconName = (status) => {
    switch(status) {
      case Status.INITIAL:
      case Status.IN_PROGRESS: 
        return "reload"
      case Status.SUCCESS:
        return "check"
      case Status.ERROR:
        return "close"
    }
  }


  return (
    <Grid container>
      <Grid item>
      <Button
        id={value}
        name={value}
        color={getStatusColor(status)}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          checkDataSource()
        }}
        variant="contained"
        size={'xsmall'}
        startIcon={
          status != Status.IN_PROGRESS ? (
            <Icon iconName={getIconName(status)}/>
          ) : (
            <Spinner size={16} />
          )
        }
        sx={(theme: any) => ({
          fontSize: 14,
          px: 1.5,
          fontWeight: 600,
          borderColor: theme.palette.borderColor.main,
        })}
      >
        Check
      </Button>
      </Grid>
    </Grid>
  )
}