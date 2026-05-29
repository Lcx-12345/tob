module ToolDemo

type :: Tool
  character(len=50) :: name
  character(len=50) :: category
  character(len=100) :: description
end type Tool

type(Tool), dimension(4) :: tools

tools(1) = Tool("Write", "FileOps", "Write files to local filesystem")
tools(2) = Tool("Read", "FileOps", "Read local files")
tools(3) = Tool("RunCommand", "Exec", "Execute terminal commands")
tools(4) = Tool("WebSearch", "Network", "Search the internet")

do i = 1, size(tools)
  print *, "[" // trim(tools(i)%category) // "] " // trim(tools(i)%name) // ": " // trim(tools(i)%description)
end do

end module ToolDemo
