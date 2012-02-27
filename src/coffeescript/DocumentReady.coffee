################################################################################
#
# Initalization
#
################################################################################

$(document).ready ->
  console.log "٩(×̯×)۶ we are kramgo ٩(×̯×)۶"
  console.log "----^*_ScrollManager_*^----"
  console.log "Copyright Alexander Aivars"
  manager = new ScrollManager({align:ScrollManager.ALIGN_CENTER})
  manager.init()
  
  # $(document).on "click", (event) =>
  #  console.log event.currentTarget
  #  console.log event.target
    
  return
