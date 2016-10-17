#!/usr/bin/python

import sys
import time
from grovepi import *

led = int(sys.argv[1])
state = int(sys.argv[2])
pinMode(led,"OUTPUT")
digitalWrite(led,state)
