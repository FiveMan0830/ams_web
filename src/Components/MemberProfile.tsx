import React from 'react'

interface MemberProfileProps { }

interface MemberProfileState { }

class MemberProfile extends React.Component<MemberProfileProps, MemberProfileState> {
  constructor(props: MemberProfileProps) {
    super(props)
  }

  render() {
    return (
      <div>Member Profile</div>
    )
  }
}

export default MemberProfile