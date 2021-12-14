# karaoke_trainer

A web-based application for you to testify your singing ability by using AI compared with original song's pitch, which targets people who want to self-testify whether they can sing or just want to know how similar when compared to the original singer. 

<img width="712" alt="Screenshot 2021-12-15 at 12 51 24 AM" src="https://user-images.githubusercontent.com/69040807/146042737-9a166c16-025d-4532-8d5e-e2533abac51d.png">

<img width="712" alt="Screenshot 2021-12-15 at 12 51 54 AM" src="https://user-images.githubusercontent.com/69040807/146042813-e8b946e7-c449-4912-b57f-edd4cdd55975.png">

<img width="712" alt="Screenshot 2021-12-15 at 12 52 16 AM" src="https://user-images.githubusercontent.com/69040807/146042869-3e560a74-3436-4be6-86a5-c18367017c6b.png">



instruction:

After manually pull update on index.js/ main.ts / main.py

1.	index.js / main.ts
   forever restart index.js
<!-- 	forever list
	find _processID_
	forever stop _processID_
	cd _index.js path_
	forever start _path_/index.js -->

2.	main.py
	 ps -ef | grep express_tornado_routing/main.py | grep -v grep | awk -F ' ' '{print $2}' | xargs kill -9
	source ~/miniconda3/etc/profile.d/conda.sh
	conda activate base
	nohup python _path_/main.py & 
** forever start -c python3 main.py
** forever log -f list number
<!-- 	ps -ef | grep python
	find _processID_
	kill -9 _processID_

	source ~/miniconda3/etc/profile.d/conda.sh
	conda activate base

	nohup python _path_/main.py & 
ps -ef | grep express_tornado_routing/main.py | grep -v grep | awk -F ' ' '{print $2}' | xargs kill -9;
          cd express_tornado_routing/;
          nohup python main.py & ps -ef | grep main.py"
-->



