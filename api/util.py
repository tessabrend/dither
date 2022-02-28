from pony.orm import Required

def render_object(to_render):
    fields = [field for field in dir(to_render) if not callable(to_render) and not field.startswith('__')]
    return { field: str(to_render[field]) for field in fields }

def field_difference(form, model, exceptions):
    return (set(form.keys()) - set(exceptions)) - set([element for element in dir(model) if isinstance(element, Required)])

def confirm_fields(form, model, exceptions=[]):
    return len(field_difference(form, model, exceptions)) == 0
