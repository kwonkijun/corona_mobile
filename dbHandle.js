var db = null;
var var_no = null;
var position = null;
var index;
 
// 데이터베이스 생성 및 오픈
function openDB(){
   db = window.openDatabase('coronaDB', '1.0', '코로나DB', 1024*1024); 
   console.log('1_DB 생성...'); 
} 
// 테이블 생성 트랜잭션 실행
function createTable() {
   db.transaction(function(tr){
   //var dropSQL = 'drop table corona';
   var createSQL = 'create table if not exists corona(option text, address text, date text, content text)';       
   tr.executeSql(createSQL, [], function(){
           console.log('2_1_테이블생성_sql 실행 성공...');        
      }, function(){
         console.log('2_1_테이블생성_sql 실행 실패...');            
      });
      }, function(){
         console.log('2_2_테이블 생성 트랜잭션 실패...롤백은 자동');
      }, function(){
         console.log('2_2_테이블 생성 트랜잭션 성공...');
     });
 } 
 // 데이터 입력 트랜잭션 실행
 function insertPlace(){ 
    db.transaction(function(tr){
        var option = $('#dangerOption1').val();
        var address = $('#address1').val();
        var date = $('#date1').val();
        var content = $('#content1').val();
        var insertSQL = 'insert into corona(option, address, date, content) values(?, ?, ?, ?)';      
        tr.executeSql(insertSQL, [option, address, date, content], function(tr, rs){    
            console.log('3_ 위험지역 등록...no: ' + rs.insertId);
            alert('위험지역 ' + $('#address1').val() + ' 이 입력되었습니다');                
            $('#address1').val('');
            $('#date1').val('');      
            $('#content1').val('');
            $('#dangerOption1').val('미정').attr('selected', 'selected'); 
            $('#dangerOption1').selectmenu('refresh');                           
      }, function(tr, err){
            alert('DB오류 ' + err.message + err.code);
         }
      );
    });      
 }

// 데이터 목록 트랜잭션 실행
function listPlaces(){
   db.transaction(function(tr){
      var order = $('#order option:selected').val();
      console.log(order)
      var selectSQL = "";
      if(order != 'no'){
         selectSQL = `select * from corona order by date ${order}`
      }else{
         var selectSQL = 'select * from corona';
      }
      console.log(selectSQL);
      tr.executeSql(selectSQL, [], function(tr, rs){
         $('#corona-list1').html('')
         for(var i = 0 ; i < rs.rows.length ; i++){
            var address = rs.rows[i].address;
            var content = rs.rows[i].content;
            var date = rs.rows[i].date;
            var option = rs.rows[i].option;
            var template = `
            <li>
               <h1>${address}</h1>
               <p><strong>${content}</strong></p>
               <p style="color : orange"><strong>${option}</strong></p>
               <p class="ui-li-aside">${date}</p>
            </li>
            `
            $('#corona-list1').append(template);
            $('#corona-list1').listview('refresh');
         }
      })
   })
}
// 데이터 검색 트랜잭션 실행
function searchPlaces(){
   db.transaction(function(tr){
      var searchWord = $('#address2').val();
      console.log(searchWord);
      var selectSQL = `select * from corona where address like '%${searchWord}%'`;
      console.log(selectSQL);
      tr.executeSql(selectSQL, [], function(tr, rs){
         $('#corona-list2').html('')
         for(var i = 0 ; i < rs.rows.length ; i++){
            var address = rs.rows[i].address;
            var content = rs.rows[i].content;
            var date = rs.rows[i].date;
            var option = rs.rows[i].option;
            var template = `
            <li>
               <a href="#page4" onclick="getData('${address}', '${content}', '${option}', '${date}')">
                  <h1>${address}</h1>
                  <p><strong>${content}</strong></p>
                  <p style="color : orange"><strong>${option}</strong></p>
                  <p class="ui-li-aside">${date}</p>
               </a>
            </li>
            `
            $('#corona-list2').append(template);
            $('#corona-list2').listview('refresh');
         }
      })
   })
}
// 데이터 수정시 값을 가져오기 위해
function getData(address, content, option, date){
   $('#address4').val(address);
   $('#date4').val(date);      
   $('#content4').val(content);
   $('#dangerOption4').val(option).attr('selected', 'selected'); 
   $('#dangerOption4').selectmenu();
   $('#dangerOption4').selectmenu('refresh'); 
}

// 데이터 입력 트랜잭션 실행
function updatePlace(){ 
   db.transaction(function(tr){
       var option = $('#dangerOption4').val();
       var address = $('#address4').val();
       var date = $('#date4').val();
       var content = $('#content4').val();
       var updateSQL = 'update corona set option = ?, address=?, date = ?, content =? where address=?';      
       tr.executeSql(updateSQL, [option, address, date, content, address], function(tr, rs){    
           alert('위험지역 ' + $('#address4').val() + ' 이 수정되었습니다');                
           $('#address4').val('');
           $('#date4').val('');      
           $('#content4').val('');
           $('#dangerOption4').val('미정').attr('selected', 'selected'); 
           $('#dangerOption4').selectmenu('refresh');                           
     }, function(tr, err){
           alert('DB오류 ' + err.message + err.code);
        }
     );
   });
}      