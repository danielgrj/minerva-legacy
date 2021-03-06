import React, { useState, useContext, useEffect } from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook } from '@fortawesome/free-solid-svg-icons'

import { ReferencesContext } from './../../context/ReferencesContext'
import Quotes from './Quotes';

export default function ReferenceOverview(props) {
  const [isVisible, setIsVisible] = useState(false)
  const { id } = props.match.params
  const { currentReference, getOneReference } = useContext(ReferencesContext)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    getOneReference(id)
    setIsVisible(false)
    setTimeout(() => {
      setIsVisible(true)
    }, 280)
  }, [id, getOneReference])

  return (
    <div>
      <CSSTransitionGroup
        transitionName="collection-overview"
        transitionAppearTimeout={600}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={200}
        component="div"
      >
        {isVisible ?
          <div className="collection-overview">
            <h2><FontAwesomeIcon icon={faBook} /> 
              {
                ` ${currentReference.authors ? `${currentReference.authors[0].lastName}, ` : ''} 
                ${currentReference.authors ? `${currentReference.authors[0].firstName.charAt(0)}.` : ''} 
                ${currentReference.title}`
              }
            </h2>
            <Quotes quotes={currentReference.quotes}/>
          </div>
          : undefined}
      </CSSTransitionGroup>
    </div>
  )
}
