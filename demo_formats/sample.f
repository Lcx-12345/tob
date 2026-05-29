module ToolDemo

type :: ToolType
  character(len=50) :: name
  character(len=50) :: category
end type

end module ToolDemo

program main
  use ToolDemo
  print *, "Fortran 77 style demo"
  print *, "Tools: Write, Read, RunCommand, WebSearch"
end program main
