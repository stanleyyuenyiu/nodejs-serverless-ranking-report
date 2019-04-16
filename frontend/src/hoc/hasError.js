import Error from 'Components/Common/Error'
import branch from './branch'

const hasError = (ErrorComponent = Error) => WrappedComponent => {
  const HasError = props => 
    branch(
        (props.apiStatus !== undefined
            && props.apiStatus.hasError),
        ErrorComponent,
        WrappedComponent)(props)

  return HasError
}

export default hasError