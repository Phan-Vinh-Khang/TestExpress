//có thể route thẳng đến func này check token,nếu có req.data(req.data!=undefine) thì neu token correct thì next
//nếu k có req.data thì return về client du correct token hay ko,sau đó nếu dung token thì client req,con k thi refresh token sau do req
//luu anh ngay o server neu thong tin ok va da dc luu truoc khi response ve client thi luu anh
//(co the call hoac viet function luu anh ngay tai currentwork)

//create 1 function remove nhieu file 1 luc (removeManyfile(path,listfile))