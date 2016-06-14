var Promise = function(fn){
  
  var result;
  var task_type = null, tasks = [];
  
  var resolve = function(_success_result){
    if(_success_result 
       && (typeof _success_result === 'object' 
           || typeof _success_result === 'function')){
      var then = _success_result.then;
      
      if(then && typeof then === "function"){
        task_type = null;
        
        then.call(_success_result, resolve, reject);
        return;
      }
    }
    
    result = _success_result;
    
    task_type = 1;
    triggerTask();
  };
  
  var reject = function(_fail_result){
    result = _fail_result;
    task_type = 2;
    triggerTask();
  };
  
  var runTask = function(success_fn, fail_fn, next_success_fn, next_fail_fn){
    
    var c_fn = task_type === 1 ? success_fn : fail_fn;
    
    if(!c_fn){
      c_fn = task_type === 1 ? next_success_fn : next_fail_fn;
      return c_fn(result);
    }
    
    var r;
    
    try{
      r = c_fn(result);
    }catch(ex){
      next_fail_fn(ex);
      return;
    }
    
    next_success_fn(r);
    
  };
  
  var triggerTask = function(){
    if(!task_type || tasks.length === 0) return;
    
    for(var i = 0; i < tasks.length; i ++){
      runTask.apply(null, tasks[i]);
    }
    tasks = [];
  };
  
  var then = function(_oFn, _nFn){
    
    return new Promise(function(resolve, reject){
      tasks.push([_oFn, _nFn, resolve, reject]);
      
      triggerTask();
    });
  };
  
  var init = function(){
    fn(resolve, reject);
  };
  
  var _model = {
    then: then
  };
  init();
  return _model;
};
