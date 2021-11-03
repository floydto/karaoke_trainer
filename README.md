# karaoke_trainer

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



