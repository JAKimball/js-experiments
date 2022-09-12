#!/usr/bin/env bun
// @ts-check

import { stdout, write } from "bun"
import { calcPi2, calcPi } from './src/pi/pi.ts'

const outPipe = {
  async write (textToOutput: string): any {
    await write(stdout, textToOutput)
  }
}

calcPi2(outPipe)
