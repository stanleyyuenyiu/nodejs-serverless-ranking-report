import Loading from 'Components/Common/Loading'
import branch from './branch'
import hasProps from './hasProps'

const hasLoader = WrappedComponent => {
  const HasLoader = props => branch(
    (props.apiStatus === undefined ||
    props.apiStatus === null ||
    props.apiStatus.isFetching),
    hasProps({message: props.loadingMessage})(Loading),
    WrappedComponent
  )(props)

  return HasLoader
}

export default hasLoader