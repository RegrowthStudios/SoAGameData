function doPrint(_, a)
    C_Print("TEST")
    C_Print(a)
end

RegisterFunction("doPrint")

onMessage("doPrint")

C_Print(tostring(C_Add(1, 5)))
