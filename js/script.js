$(function() {
  const rule = "じゃんけんで勝つと星が1つもらえます。<br>負けると星が一つ減ります。<br>手札がなくなるまでに10個獲得してください。<br>"
  const no_hands_alert = "指定した手札はもうありません。";
  const first_message = "手札を選択して、VSボタンをクリックしてください。<br>";
  const victory_message = "大勝利！！<br>";
  const lose_message = "地下送り決定！！<br>";
  const no_more_hands="手札がありません<br>"
  const tryagain_message = "F5で再挑戦できるよ！！";
  const push_next = "→次へ ボタンを押してください。<br>"

  var $pre_rock_num;
  var $pre_paper_num;
  var $pre_sissors_num;
  var next_trigger;
  var $hand; //プレイヤーの選んだ手札のタグ

  initHandsNum();
  $('.message_window_in').html(rule+first_message);

  // 選択した絵を表示する。
  $('.hands_choice').click(function() {
    var hands_id = $(this).attr('hands_id');

    if (isHandsNum(hands_id)) {
      alert(no_hands_alert);
    } else {
      initHands();
      $('#no_choice').addClass('non_select');
      if (hands_id === '1') {
        $hand = $('#rock');
      } else if (hands_id === '2') {
        $hand = $('#paper');
      } else {
        $hand = $('#sissors');
      }
      $hand.removeClass('non_select');
    }
  });

  //VSボタン押下時処理
  $('.versus').click(function() {
    //自分の手が選択されている確認
    if ($('#no_choice').attr('class').includes('non_select') == false) {
      $('.message_window_in').html('手札を選んでやり直し');
    } else {
      //処理が完了するまで次へボタン以外無効化
      pointerEventsAllnone();
      //次へボタン表示
      $('.next_button').css('display', 'inherit');
      $('.message_window_in').html('相手が手札選択中・・・<br>' + push_next);
      //CPの手札選択 1:グー、2:パー 3:チョキ
      var cp_hands_id = Math.floor(Math.random() * 3 + 1);
      next_trigger = 0;
      var next_message = setInterval(function() {
          if (next_trigger === 1) {
            //あいての手札を変更する。
            changeHandsPic(cp_hands_id);
            //互いの手札をメッセージで作成
            var disp_message = '手札オープン!!<br>あなた：';

            if ($hand.attr('id').includes('rock') == true) {
              disp_message += 'グー<br>';
            } else if ($hand.attr('id').includes('paper') == true) {
              disp_message += 'パー<br>';
            } else {
              disp_message += 'チョキ<br>';
            }

            if (cp_hands_id === 1) {
              disp_message += 'あいて：グー<br>';
            } else if (cp_hands_id === 2) {
              disp_message += 'あいて：パー<br>';
            } else {
              disp_message += 'あいて：チョキ<br>'
            }
            //じゃんけん結果判定 0:引き分け、1:勝ち、2:負け
            if (rpsResult(cp_hands_id) === 0) {
              disp_message += '引き分けです。<br>'
            } else if (rpsResult(cp_hands_id) === 1) {
              disp_message += 'あなたの勝ち！<br>'
              //星の数+1
              $('.star_num').text(Number($('.star_num').text()) + 1);
              //勝利画像に変更
              $('#player_icon').attr('src', '../img/pose_win_boy.png');
            } else {
              disp_message += 'あなたの負け<br>'
              //星の数-1
              $('.star_num').text(Number($('.star_num').text()) - 1);
              //敗北画像に変更
              $('#player_icon').attr('src', '../img/pose_lose_boy.png');
            }

            //星の数をメッセージに追加
            disp_message = disp_message + '残りの星の数:' + $('.star_num').text() +'<br>'+ push_next;

            //メッセージ表示
            $('.message_window_in').html(disp_message);
            clearInterval(next_message);
          }
          next_trigger = 0;
          initHandsNum();
          var next_battle = setInterval(function() {
            if (next_trigger === 1) {
              if (9 < Number($('.star_num').text())) {
                $('.message_window_in').html(victory_message + tryagain_message);
              } else if (Number($('.star_num').text()) <= 0) {
                $('.message_window_in').html(lose_message + tryagain_message);
              } else if ($pre_rock_num === 0 && $pre_paper_num === 0 && $pre_sissors_num === 0) {
                $('.message_window_in').html(lose_message + no_more_hands + tryagain_message);
              } else {
                initHands();
                $('#player_icon').attr('src', '../img/player1.png');
                $('.message_window_in').html(first_message);
              }
              clearInterval(next_battle);
              pointerEventsAllauto();
              $('.next_button').css('display', 'none');
            }
          }, 1000);
        },
        1000);
      }
  });

  //「次へ」ボタン押下時処理
  $('.next_button').click(function() {
    next_trigger = 1;
  });



  //以下関数

  function initHandsNum() {
    $pre_rock_num = Number($('#rock_num').text());
    $pre_paper_num = Number($('#paper_num').text());
    $pre_sissors_num = Number($('#sissors_num').text());
  }

  function initHands() {
    $('#no_choice').removeClass('non_select');
    $('#rock').addClass('non_select');
    $('#paper').addClass('non_select');
    $('#sissors').addClass('non_select');
    $('.cp_hands').attr('src', '../img/back_card.png');
  }

  function resetHandsNum() {
    $('#rock_num').text($pre_rock_num);
    $('#paper_num').text($pre_paper_num);
    $('#sissors_num').text($pre_sissors_num);
  }

  function isHandsNum(hands_id) {
    var $hand_num;
    resetHandsNum();
    if (hands_id === '1') {
      $hand_num = $('#rock_num');
    } else if (hands_id === '2') {
      $hand_num = $('#paper_num');
    } else {
      $hand_num = $('#sissors_num');
    }
    if (0 <= Number($hand_num.text()) - 1) {
      $hand_num.text(Number($hand_num.text()) - 1);
      return 0;
    } else {
      return 1;
    }
  }

  function changeHandsPic(cp_hands_id) {
    if (cp_hands_id == '1') {
      $('.cp_hands').attr('src', '../img/rock.jpg');
    } else if (cp_hands_id == '2') {
      $('.cp_hands').attr('src', '../img/paper.jpg');
    } else {
      $('.cp_hands').attr('src', '../img/sissors.jpg');
    }
  }

  function rpsResult(cp_hands_id) {
    if ($hand.attr('id').includes('rock') == true) {
      if (cp_hands_id === 1) {
        return 0;
      } else if (cp_hands_id === 2) {
        return 2;
      } else {
        return 1;
      }
    } else if ($hand.attr('id').includes('paper') == true) {
      if (cp_hands_id === 1) {
        return 1;
      } else if (cp_hands_id === 2) {
        return 0;
      } else {
        return 2;
      }
    } else {
      if (cp_hands_id === 1) {
        return 2;
      } else if (cp_hands_id === 2) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  //次へボタン以外を押せなくする
  function pointerEventsAllnone(){
    $('.versus').css('pointer-events','none');
    $('.player_hands_left').css('pointer-events','none');
  }
  function pointerEventsAllauto(){
    $('.versus').css('pointer-events','auto');
    $('.player_hands_left').css('pointer-events','auto');
  }

});
