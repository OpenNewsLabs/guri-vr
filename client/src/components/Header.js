
import { h } from 'preact'
import LangSwitch from 'components/LangSwitch'
import TopBar from 'components/TopBar'
import { Link } from 'preact-router'
import { logout } from 'services/datalayer'

export default () => (
  <div>
    <LangSwitch />
    <TopBar />
  </div>
)
