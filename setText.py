#!/usr/bin/python

import sys
from grovepi import *
from grove_rgb_lcd import *

if len(sys.argv) == 2:
	setText(str(sys.argv[1]));
elif len(sys.argv) == 4:
	setRGB(int(sys.argv[1]),int(sys.argv[2]),int(sys.argv[3]))
elif len(sys.argv) == 5:
	setText(sys.argv[4]);
	setRGB(int(sys.argv[1]),int(sys.argv[2]),int(sys.argv[3]))
else:
	print("Usage:")
	print(" ",sys.argv[0]," text")
	print(" ",sys.argv[0]," R G B")
	print(" ",sys.argv[0]," R G B text")
