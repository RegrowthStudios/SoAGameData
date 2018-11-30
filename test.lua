function doPrint(_, a)
    C_Print("TEST")
    C_Print(a)
    onMessage.unsubscribe("doPrint");
end

onMessage.subscribe("doPrint")

C_Print(tostring(C_Add(1, 5)))
