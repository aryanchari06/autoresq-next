"use client"
import dynamic from "next/dynamic"
const MapComp = dynamic(()=> import("./Map"), {ssr:false});

import React from 'react'

export default function Page() {
  return (
    <MapComp/>
  )
}
