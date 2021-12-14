# karaoke_trainer

A web-based application for you to testify your singing ability by using AI compared with original song's pitch, which targets people who want to self-testify whether they can sing or just want to know how similar when compared to the original singer. 

<img width="719" alt="Screenshot 2021-12-15 at 12 53 47 AM" src="https://user-images.githubusercontent.com/69040807/146043109-a2b158cf-ced7-4824-aed0-8421bb1a3b16.png">

<img width="715" alt="Screenshot 2021-12-15 at 12 54 37 AM" src="https://user-images.githubusercontent.com/69040807/146043253-c735a632-55a5-487a-bfc1-45c629e8ed9f.png">

<img width="715" alt="Screenshot 2021-12-15 at 12 55 29 AM" src="https://user-images.githubusercontent.com/69040807/146043398-784b9d30-766e-45b4-9c5f-33e4c53267f3.png">

<img width="715" alt="Screenshot 2021-12-15 at 12 54 57 AM" src="https://user-images.githubusercontent.com/69040807/146043305-68491576-0c04-42df-bd08-a16b83e38e50.png">


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



