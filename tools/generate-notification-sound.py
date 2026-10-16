"""Original Pet Care three-note chime, synthesized locally; no third-party recording."""
import math, struct, wave
from pathlib import Path
rate=22050;duration=1.35
samples=[]
for i in range(int(rate*duration)):
 t=i/rate;v=0
 for start,freq in [(0,659.255),(0.19,783.991),(0.42,1046.502)]:
  dt=t-start
  if dt>=0:
   envelope=(1-math.exp(-dt*100))*math.exp(-dt*5.8)
   v+=0.24*envelope*(math.sin(2*math.pi*freq*dt)+0.22*math.sin(2*math.pi*2*freq*dt)*math.exp(-dt*5))
 samples.append(struct.pack('<h',int(max(-.95,min(.95,v))*32767)))
p=Path('www/petcare_chime.wav')
with wave.open(str(p),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(b''.join(samples))
print('Original chime:',p)
